function getGmail() {
  var scriptName         = "getGmail";
  // VARIABLES START //
  var sheetId            = "2nB4aik2C4eaXkqtn2HJxndfVDAiXtn0zhh_NCz5K-i0";
  var docId              = "2HrO3EkDIeNh64nEQtN7A8IoBNLTBPlHDrKDgsduP0ZY";
  var label              = "youtube";
  var playlistId         = "1L1YG9ktx9sVdwWMZzEY7MtcNzomEjbljI";
  
  var videoIdTxtStart    = "watch%3Fv%3D"; //exclusive search string, lower boundary
  var videoIdTxtEnd      = "%26"; //exclusive search string, upper boundary
  var videoTitleTxtStart = '%3Dem-uploademail" style="text-decoration:none;color:#468aca" target="_blank">'; //exclusive search string, lower boundary
  var videoTitleTxtEnd   = "</a>"; //exclusive search string, upper boundary
  var videoIgnoreWthTxt1 = "font-family:arial,Arial,sans-serif;font-size:20px;line-height:25px;letter-spacing:0px;font-weight:bold;color:#222222"; //messages with this text will be ignored
  var videoIgnoreWthTxt2 = 'is live streaming'; //messages with this text will be ignored
  
  var gmailApiQuota      = 150; //very rough estimate of quota limits, exists only so that there is always a watchdog for "too much"
  var youtubeApiQuota    = 100;
  // VARIABLES END //
 
  var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  var doc = DocumentApp.getActiveDocument().getBody().editAsText();
  
  if (sheet.getRange('A1').getValue() == true) { // Prevents concurrent access (collisions) to shared resources
    Utilities.sleep(30000);
    Logger.log("[" + scriptName + "] NOTICE: Extra wait for exclusive access"); doc.appendText(Logger.getLog()); Logger.clear();
  }
  
  if (sheet.getRange('A1').getValue() == false) {
    sheet.getRange('A1').setValue(true);
    
    try {
      var threads = GmailApp.search("label:" + label + " is:unread");
    } catch (e) {
      Logger.log("[" + scriptName + "] ERROR: " + e.message); doc.appendText(Logger.getLog()); Logger.clear();
      sheet.getRange('A1').setValue(false);
      return;
    }
    var startRow = sheet.getLastRow() + 1;
    var row = startRow;
    var usedQuota = 0;
    
    for (var i = 0; i < threads.length && usedQuota < gmailApiQuota; i++, usedQuota++) {
      var messages = threads[i].getMessages();
      
      Utilities.sleep(1000);
      
      for (var m = 0; m < messages.length && usedQuota < gmailApiQuota; m++, usedQuota++) {
        if (messages[m].isUnread()) {
          var body = messages[m].getBody();
          if (body.search(videoIgnoreWthTxt1) != -1 || body.search(videoIgnoreWthTxt2) != -1) continue;
          
          var msg = body;
          var index = msg.search(videoIdTxtStart);
          msg = msg.substring(index + videoIdTxtStart.length);
          index = msg.search(videoIdTxtEnd);
          sheet.getRange(row, 1).setValue(msg.substring(0, index));
          
          sheet.getRange(row, 2).setFormula('=hyperlink("' + "https://www.youtube.com/watch?v=" + sheet.getRange(row, 1).getValue() + '", "View")'); 

          index = body.search(videoTitleTxtStart);
          body = body.substring(index + videoTitleTxtStart.length);
          index = body.search(videoTitleTxtEnd);
          sheet.getRange(row, 3).setValue(body.substring(0, index));
          
          index = msg.search(videoTitleTxtStart);
          msg = msg.substring(index + videoTitleTxtStart.length);
          index = msg.search(videoTitleTxtEnd);
          sheet.getRange(row, 4).setValue(msg.substring(0, index));
          
          row++;
          messages[m].markRead();
        }
      }
    }
    if (row != startRow) {
      Logger.log("[" + scriptName + "] Acquired items: " + (row - startRow)); doc.appendText(Logger.getLog()); Logger.clear();
      if (startRow != 2) {
        Logger.log("[" + scriptName + "] NOTICE: startRow = " + startRow); doc.appendText(Logger.getLog()); Logger.clear();
      }
    }
    else {Logger.log("[" + scriptName + "] Acquired no items"); doc.appendText(Logger.getLog()); Logger.clear();}
    
    sheet.getRange('A1').setValue(false);
  }
  else {
    sheet.getRange('A1').setValue(false);
    Logger.log("[" + scriptName + "] ERROR: Failed to acquire exclusive access"); doc.appendText(Logger.getLog()); Logger.clear();
  }
}

function onOpen() {
  DocumentApp.getUi().createMenu('Functions').addItem('getGmail', 'getGmail').addItem('manuallyClearAllPlaylist', 'manuallyClearAllPlaylist').addToUi();
}
