/* Test Method */
function test(){
  fetchJiraData('PROJECT-123', 'priority///name', 1); 
}

/**
 * The onOpen() function, when defined, is automatically invoked whenever the spreadsheet is opened.
 */
function onOpen(e) {
  promptForCredentials();   
};

/**
 * Prompts the user for credentials if none are stored or if stored creds are invalid.
 */

function promptForCredentials(){
  var authFailure = getProperty('authFailure');
  if(authFailure == 'true'){
    clearProperties(); 
  }
  
  var username = getProperty('username');
  var password = getProperty('password');
  
  //Promt for credentials
  if(username == null || password == null){
    var ui = SpreadsheetApp.getUi();
    var usernameResponse =  ui.prompt('Jira Integration', 'This sheet integrates with Jira!\n\n Jira Username?', ui.ButtonSet.OK);
    var passwordResponse =  ui.prompt('Jira Integration', 'Jira Password?', ui.ButtonSet.OK);
    
    setProperty('username', usernameResponse.getResponseText());
    setProperty('password', passwordResponse.getResponseText()); 
  }
}

/**
 * Fetches data from Jira
 * @param {string} issueKey    The key with which to identify the ticket. (ie; PROJECT-123)
 * @param {string} prop        The property to retrieve, with child properties delimited by "///". (ie; "property///subproperty")
 * @param {object} cacheBuster A cache buster value that triggers a refresh.
 * @return {} The value of prop on the ticket identified by issueKey
 */
function fetchJiraData(issueKey, prop, cacheBuster) { 
  if(!issueKey || !prop){
   return ""; 
  }
  
  var username = getProperty('username');
  var password = getProperty('password');
  
  var encodedAuthString = Utilities.base64Encode(username + ":" + password);
  
  var options = {
    "headers" : {
      "Authorization" : "Basic " + encodedAuthString,
    }
  }
  
  var result;
  try{
    result = UrlFetchApp.fetch("https://{Jira URL}/rest/api/latest/issue/" + issueKey, options);
  }
  catch(e){
    setProperty('authFailure', 'true') 
  }
  
  var o  = Utilities.jsonParse(result.getContentText());
  Logger.log(result.getContentText());
  
  var props = prop.split('///');
  
  var result = o.fields[props[0]];
  for (var i = 1; i < props.length; i++){
    if(!result){
      return '';
    }
    result = result[props[i]];
  }
  
  if(result instanceof Array){
    return result.join(", ");
  }
  
  return result;
}



/* Property Methods */

function getProperty(key){
  return PropertiesService.getUserProperties().getProperty(key);
}

function setProperty(key, value){
  CacheService.getPrivateCache().put(key,value);
  PropertiesService.getUserProperties().setProperty(key, value)
}

function clearProperties(){
  PropertiesService.getUserProperties().deleteAllProperties();
}
