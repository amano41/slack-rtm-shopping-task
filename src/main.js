function doPost(e) {

    var properties = PropertiesService.getScriptProperties().getProperties();
    var token = properties.VERIFICATION_TOKEN;

    // 身元確認
    if (token != e.parameter.token) {
      throw new Error("Invalid Token");
    }

    var text = e.parameter.text;

    // 改行を含む場合はチャット発言とみなして終了
    if (text.indexOf('\n') !== -1) {
      Logger.log("Text is consisted of multiple lines.")
      Logger.log(text)
      return;
    }

    // タスクから URL を抽出
    var [task, url] = parseTask(text);

    // 文字数が 15 文字よりも多ければチャット発言とみなして終了
    if (task.length > 15) {
      Logger.log("Task is longer than 15 characters.")
      Logger.log(task)
      return;
    }

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
    url = formatURL(match[1]);
  }

  Logger.log("Task: " + task);
  Logger.log("URL: " + url);

  return [task, url];
}


function formatURL(url) {

  if (!url) {
    return url;
  }

  if (url.match(/amazon.co.jp/)) {
    var pattern = /(dp|gp\/product)\/([a-zA-Z0-9]+)/;
    var match = url.match(pattern);
    if (match) {
      return "https://www.amazon.co.jp/dp/" + match[2];
    }
  }

  return url;
}


function addTask(task, url) {

  var properties = PropertiesService.getScriptProperties().getProperties();
  var recipient = properties.RTM_EMAIL_ADDRESS;

  var subject = "買い物：" + task;

  var body = "t: " + subject + "\n"
           + "l: Action\n"
           + "s: life shopping\n"
           + "a: Today\n";

  if (url != null) {
    body += "u:" + url + "\n";
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
