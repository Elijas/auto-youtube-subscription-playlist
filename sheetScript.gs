function putYoutube() {
  var scriptName         = "putYoutube";
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
 
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var doc = DocumentApp.openById(docId).getBody().editAsText();
  
  if (sheet.getRange('A1').getValue() == true) { // Prevents concurrent access (collisions) to shared resources
    Utilities.sleep(30000);
    Logger.log("[" + scriptName + "] NOTICE: Extra wait for exclusive access"); doc.appendText(Logger.getLog()); Logger.clear();
  }
  
  if (sheet.getRange('A1').getValue() == false) {
    sheet.getRange('A1').setValue(true);
    
    // Delete empty rows
    var sheet = SpreadsheetApp.getActiveSheet();
    for (var i=2; i<=sheet.getLastRow(); i++) {
      if (!sheet.getRange("A"+i.toString()).getValue() && !sheet.getRange("C"+i.toString()).getValue()) sheet.deleteRow(i--);
    }
    
    // Add videos to the playlist
    var usedQuota = 0;
    
    var items = sheet.getLastRow()-1;
    for (var i = 0; i < items && usedQuota < youtubeApiQuota; i++, usedQuota++) {
      var cell = sheet.getRange("A2");
      var videoId = cell.getValue();

      Utilities.sleep(1000);
      
      try {
        YouTube.PlaylistItems.insert({snippet: {
          playlistId: playlistId, resourceId: {
          videoId: videoId, kind: 'youtube#video'}}}, 'snippet,contentDetails');
      } catch (e) {
        // Put the (likely) faulty item to the end and continue
        var newRow = sheet.getLastRow() + 1;
        sheet.getRange(newRow, 1).setValue(sheet.getRange(2, 1).getValue());
        sheet.getRange(newRow, 2).setValue(sheet.getRange(2, 2).getValue());
        sheet.getRange(newRow, 3).setValue(sheet.getRange(2, 3).getValue());
        sheet.getRange(newRow, 4).setValue(sheet.getRange(2, 4).getValue());
        sheet.deleteRow(2);
        
        Logger.log("[" + scriptName + "] ERROR: " + e.message); doc.appendText(Logger.getLog()); Logger.clear();
        sheet.getRange('A1').setValue(false);
        continue;
      }
            
      sheet.deleteRow(2);
      sheet.appendRow(['']);
    }
    
    if (items != 0) {Logger.log("[" + scriptName + "] Inserted items: " + (usedQuota<youtubeApiQuota ? items : usedQuota)); doc.appendText(Logger.getLog()); Logger.clear();}
    else {Logger.log("[" + scriptName + "] Inserted no items"); doc.appendText(Logger.getLog()); Logger.clear();}
    
    sheet.getRange('A1').setValue(false);
  }
  else {
    sheet.getRange('A1').setValue(false);
    Logger.log("[" + scriptName + "] ERROR: Failed to acquire exclusive access"); doc.appendText(Logger.getLog()); Logger.clear();
  }
}

function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Functions", [{name: "putYoutube", functionName: "putYoutube"}]);
}
