function doPost(e) {

    var properties = PropertiesService.getScriptProperties().getProperties();
    var token = properties.VERIFICATION_TOKEN;

    // 身元確認
    if (token != e.parameter.token) {
      throw new Error("Invalid Token");
    }

    var text = e.parameter.text;

    // タスクから URL を抽出
    var [task, url] = parseTask(text);

    // 買い物タスクを追加
    addTask(task, url);
}


function parseTask(text) {

  var pattern = /<(https?:\/\/[a-zA-Z0-9.\-_@:/~?&%=+#;',()*!$]+)>/;

  var task = text;
  var url;

  var match = text.match(pattern);
  if (match) {
    task = text.replace(pattern, "").trim();
    url = match[1];
  }

  Logger.log("Task: " + task);
  Logger.log("URL: " + url);

  return [task, url];
}


function addTask(task, url) {

  var properties = PropertiesService.getScriptProperties().getProperties();
  var recipient = properties.RTM_EMAIL_ADDRESS;

  var subject = "買い物：" + task;

  var body = "t: " + task + "\n"
           + "l: Shopping\n"
           + "s: life\n";

  if (url != null) {
    body += "u: " + url + "\n";
  }

  Logger.log("To: " + recipient);
  Logger.log("Subject: " + subject);
  Logger.log("Message: " + body);

  MailApp.sendEmail(recipient, subject, body);
}


function testDoPost() {

    var properties = PropertiesService.getScriptProperties().getProperties();
    var token = properties.VERIFICATION_TOKEN;

    var e = {
      parameter : {
        "token" : token,
        "channel_name" : "shopping",
        "user_name" : "test",
        "text" : "something to buy <https://www.amazon.co.jp/dp/XXXXXXXXX>",
      }
    };

    Logger.log(e);

    doPost(e);
}
