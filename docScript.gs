function getGmail() {
  var scriptName         = "getGmail";
  // VARIABLES START //
  var sheetId            = "1WmiJC6Z74XaLChQs-UQYAFIQO5d3d4hcGiNkulJAY14";
  var docId              = "1Sg7UsPqknxXtAxBjEjFOTFa2KZr4i0PP3Ves5awE7-Y";
  var label              = "youtube";
  var playlistId         = "PQ1YG9ktx9sVdz4fgSnff5mSmqIR669Ox6";
  
  var videoIdTxtStart    = "watch%3Fv%3D"; //exclusive search string, lower boundary
  var videoIdTxtEnd      = "%26"; //exclusive search string, upper boundary
  var videoTitleTxtStart = '%3Dem-uploademail" style="text-decoration:none;color:#468aca" target="_blank">'; //exclusive search string, lower boundary
  var videoTitleTxtEnd   = "</a>"; //exclusive search string, upper boundary
  
  var gmailApiQuota      = 150;
  var youtubeApiQuota    = 100;
  // VARIABLES END //
  
  var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  var doc = DocumentApp.getActiveDocument().getBody().editAsText();
  
  Logger.log("[" + scriptName + "] activated"); doc.appendText(Logger.getLog()); Logger.clear();
  
  if (sheet.getRange('A1').getValue() == true) { // Prevents concurrent access (collisions) to shared resources
    Utilities.sleep(30000);
    Logger.log("[" + scriptName + "] NOTICE: Extra wait for exclusive access"); doc.appendText(Logger.getLog()); Logger.clear();
  }
  
  if (sheet.getRange('A1').getValue() == false) {
    sheet.getRange('A1').setValue(true);
    
    var threads = GmailApp.search("label:" + label + " is:unread");
    var startRow = sheet.getLastRow() + 1;
    var row = startRow;
    var usedQuota = 0;
    
    for (var i = 0; i < threads.length && usedQuota < gmailApiQuota; i++, usedQuota++) {
      var messages = threads[i].getMessages();
      
      Utilities.sleep(1000);
      
      for (var m = 0; m < messages.length && usedQuota < gmailApiQuota; m++, usedQuota++) {
        if (messages[m].isUnread()) {
          var body = messages[m].getBody();
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
    else Logger.log("[" + scriptName + "] Acquired no items"); doc.appendText(Logger.getLog()); Logger.clear();
    
    sheet.getRange('A1').setValue(false);
  }
  else {
    Logger.log("[" + scriptName + "] ERROR: Failed to acquire exclusive access"); doc.appendText(Logger.getLog()); Logger.clear();
  }
  
  Logger.log("[" + scriptName + "] ended successfully"); doc.appendText(Logger.getLog()); Logger.clear();
}

function onOpen() {
  DocumentApp.getUi().createMenu('Functions').addItem('getGmail', 'getGmail').addToUi();
}

