use worker::*;
use serde::{Serialize,Deserialize};
use serde_json::from_str;

#[derive(Serialize,Deserialize,Debug)]
struct Users {
    id: u32,
    name: String,
}

#[event(fetch, respond_with_errors)]
pub async fn main(request: Request, env: Env, _ctx: Context) -> Result<Response> {
    
    // let cors = Cors::default().with_origins(vec!["http://localhost:3000", "https://cloudflare-anything.pages.dev/"]);
    let cors = Cors::default().with_origins(vec!["*"]);
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
