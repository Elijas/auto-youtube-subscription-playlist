function putYoutube() {
  var scriptName         = "putYoutube";
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
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var doc = DocumentApp.openById(docId).getBody().editAsText();
  
  Logger.log("[" + scriptName + "] activated"); doc.appendText(Logger.getLog()); Logger.clear();
  
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
      
      YouTube.PlaylistItems.insert({snippet: {
        playlistId: playlistId, resourceId: {
        videoId: videoId, kind: 'youtube#video'}}}, 'snippet,contentDetails');
      
      sheet.deleteRow(2);
    }
    
    if (items != 0) Logger.log("[" + scriptName + "] Inserted items: " + (usedQuota<youtubeApiQuota ? items : usedQuota));
    else Logger.log("[" + scriptName + "] Inserted no items");
    
    sheet.getRange('A1').setValue(false);
  }
  else {
    Logger.log("[" + scriptName + "] ERROR: Failed to acquire exclusive access"); doc.appendText(Logger.getLog()); Logger.clear();
  }
    
  Logger.log("[" + scriptName + "] ended successfully"); doc.appendText(Logger.getLog()); Logger.clear();
}

function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Functions", [{name: "putYoutube", functionName: "putYoutube"}]);
}

