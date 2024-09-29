use worker::*;
use serde::{Serialize,Deserialize};
use serde_json::from_str;
use std::convert::Infallible;
use futures::StreamExt;

#[derive(Serialize,Deserialize,Debug)]
struct Users {
    id: u32,
    name: String,
}

#[event(fetch, respond_with_errors)]
pub async fn main(request: Request, env: Env, _ctx: Context) -> Result<Response> {
    
    let cors = Cors::default().with_origins(vec!["https://cloudflare-anything.pages.dev/"]);
    // let cors = Cors::default().with_origins(vec!["*"]);
      Router::new()
        .get_async("/", |_, ctx| async move {
                    //get all users
            let d1 = ctx.env.d1("DB")?;
            let statement = d1.prepare("select * from users");
            let result = statement.all().await?;
      Response::from_json(&result.results::<Users>().unwrap())
        })
        .get_async("/:id", |_, ctx| async move {
                    //get user by id
            let id = ctx.param("id").unwrap();
            let d1 = ctx.env.d1("DB")?;
            let statement = d1.prepare("select * from users where id = ?1");
            let query = statement.bind(&[id.into()])?;
            let result = query.first::<Users>(None).await?;
            match result {
                Some(user) => Response::from_json(&user),
                None => Response::error("Not found", 404),
            }
        })
        .get_async("/sse-users", |_req, ctx| async move {
          let d1 = ctx.env.d1("DB")?;
      
          // Fetch all users from the database
          let statement = d1.prepare("SELECT * FROM users");
          let result = statement.all().await?;
          let users = result.results::<Users>().unwrap();
      
          // Convert the users list to JSON and format it for SSE
          let stream = futures::stream::unfold(users.into_iter(), |mut users_iter| async {
              match users_iter.next() {
                  Some(user) => {
                      // SSE format: "data: {json}\n\n"
                      let event = format!(
                          "data: {}\n\n",
                          serde_json::to_string(&user).unwrap()
                      );
                      Some((event, users_iter))
                  }
                  None => None,
              }
          });
      
          // Create the response as an SSE stream
          let mut resp = Response::from_stream(
            stream.map(|data| Ok::<Vec<u8>, Infallible>(data.as_bytes().to_vec()))
        )?;
          resp.headers_mut().set("Content-Type", "text/event-stream")?;
          resp.headers_mut().set("Cache-Control", "no-cache")?;
          resp.headers_mut().set("Connection", "keep-alive")?;
      
          Ok(resp)
      })
      .post_async("/", |mut req, ctx| async move {
      //post user
      let json_text = req.text().await?;
      let user: Users = from_str(json_text.as_str()).unwrap();

      let d1 = ctx.env.d1("DB")?;
            let statement = d1.prepare("insert into users (id, name) values (?1, ?2)");
            let query = statement.bind(&[user.id.into(),user.name.into()])?;
            let result = query.run().await?;
            console_log!("{:?}",result.success());
            Response::ok("post ok!")  
        })
        .run(request, env)
        .await?
	      .with_cors(&cors)
}
