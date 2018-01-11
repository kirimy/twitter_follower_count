
//twitterID:891200913272061952

// OAuth1認証用インスタンス
var twitter = TwitterWebService.getInstance(
  'yJIxdCHjnIquoL5POzpr76XHg',
  'dwewsCWZu8p0sGnnPNVKzJVwXtpsw0f6FvrgTFWWaFHd2g9u4I'
);

//OAuth1ライブラリを導入したうえで、getServiceを上書き
twitter.getService = function() {
  return OAuth1.createService('Twitter2')
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
    .setConsumerKey(twitter.consumer_key)
    .setConsumerSecret(twitter.consumer_secret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
}

// 認証を行う（必須）
function authorize() {
  twitter.authorize();
}

// 認証をリセット
function reset() {
  twitter.reset();
}

// 認証後のコールバック（必須）
function authCallback(request) {
  return twitter.authCallback(request);
}

// タイムラインを取得
function getUserTimeline() {
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/users/show.json?user_id=891200913272061952&include_entities=true');
 // var  = service.fetch(followers_count);
  Logger.log(JSON.parse(response));
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet.getRange("c1").setValue(Logger.getLog());
}


function user_data_parse() {
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/users/show.json?user_id=891200913272061952&include_entities=true');
  var user = JSON.parse(response);

  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var sh = sheet.getSheets()[0];
  sh.activate();

  var row = sheet.getLastRow()+1;
  var updateRange = sheet.getRange('A' + row) //更新日をいれる列をstringで指定。
  
  //更新日の記入
  updateRange.setValue(new Date());
  // フォロワー数記入
  sheet.getRange("B" + row).setValue(user['followers_count']);
  // Tweet数
  sheet.getRange("C" + row).setValue(user['statuses_count']);
  // ReTweet数
  // sheet.getRange("D" + row).setValue(user['retweeted_status']);
  
  if(sheet.getLastRow()>168){ //1週間経ったら新しいシート作成
    var name = Utilities.formatDate(new Date(), 'Asia/Tokyo' ,'yyyy/MM/dd');
    sheet.insertSheet(name, 0);
    sh = sheet.getSheets()[0];
    sh.activate();
    sheet.getRange("A1").setValue("DATE");
    sheet.getRange("B1").setValue("Followers");
    sheet.getRange("C1").setValue("Tweet");
       
    var row_sh = sh.getLastRow()+1;
    //更新日の記入
    sh.getRange("A" + row_sh).setValue(new Date());
    // フォロワー数記入
    sh.getRange("B" + row_sh).setValue(user['followers_count']);
    // Tweet数
    sh.getRange("C" + row_sh).setValue(user['statuses_count']);
    
    /* var chartBuilder = Charts.newLineChart()
       .setTitle('Date and Followers')
       .setXAxisTitle('Date')
       .setYAxisTitle('Followers')
       .setDimensions(600, 500)
       .setRange('A1','B200');
    
    sh.insertChart(chartBuilder.build());
    */
    
   // Logger.log(chartBuilder);
    
  }
  
} 




function user_data() {
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/users/show.json?user_id=891200913272061952&include_entities=true');
  var user = JSON.parse(response);
  Logger.log(user);

  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Tweet数
  sheet.getRange("C4").setValue(user['statuses_count']);
  
 // var response = service.fetch('https://api.twitter.com/1.1/retweet_count.json');
  var recount = JSON.parse(response);
  Logger.log(recount)
  
} 


function tweet_data() {
  var service  = twitter.getService();
    //2枚目のシートを指定
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sh = sheet.getSheets()[1];
  sh.activate();
  var date = new Date();
  var yesterday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1 , date.getHours(), date.getMinutes(),0);
  var ydy = Utilities.formatDate(yesterday,"JST","yyyy-MM-dd-hh-mm-ss");
  
  var response = service.fetch('https://api.twitter.com/1.1/search/tweets.json?q=cchannel_mag&lang=ja&until='+ ydy +'&count=10&include_entities=true');
  var tweet = JSON.parse(response);
 // Logger.log(tweet);
  
 // var id = [];
 //   id[0] = response["id_str"];
 //   id[1] = 
 // Logger.log(id[0]);
  
  var post = service.fetch("https://data-api.twitter.com/insights/engagement/historical" ,{
    "tweet_ids": [
        "919337184292896768",
      　　　　"223456789"
    ],
      "engagement_types": [
        "impressions",
        "url_clicks"                                                                               
    ],
    "groupings": {
      "group1": {
        "group_by": [
          "tweet.id",
          "engagement.type"
        ]
      }
    }                                                                                       
 });
  
  var jsonData = JSON.parse(post);
  
  Logger.log(jsonData);

sheet.getRange("c1").setValue(Logger.getLog());

  /*
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  

  
  var row = sheet.getLastRow()+1;
  
  //更新日の記入
  var updateRange = sheet.getRange('A' + row) 
  updateRange.setValue(date);
  
  // フォロワー数記入
  sheet.getRange("B" + row).setValue(tweet['followers_count']);
  // Tweet数
  sheet.getRange("C" + row).setValue(tweet['statuses_count']);
  // ReTweet数
  // sheet.getRange("D" + row).setValue(user['retweeted_status']);
  
  */
} 


