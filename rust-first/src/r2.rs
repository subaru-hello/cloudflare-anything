use worker::*;
use crate::SharedData;

pub async fn get(_req: Request, ctx: RouteContext<SharedData>) -> Result<Response> {
    //bindしたバケット名を指定
    let bucket = ctx.bucket("HELLO")?;

    //パスからキー名を取得
    let key = ctx.param("key").unwrap();
    let item = bucket.get(key).execute().await?.unwrap();
    let item_body = item.body().unwrap();
    let bytes = item_body.bytes().await.unwrap();
    let response = Response::from_bytes(bytes)?;
    let mut headers = Headers::new();
    headers.set("content-type","image/png")?;
    Ok(response.with_headers(headers))
}