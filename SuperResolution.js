// ALL FILES MUST HAVE THE SAME WIDTH AND HEIGHT

try {
  // Prompt the user to choose image files
  var fileDialog = File.openDialog("Select image files", "*.jpg;*.png;*.tif;*.jpeg", true);

  if (fileDialog) {

    // Open the first file to find the width and height
    var firstFile = app.open(File(fileDialog[0].fsName));
    var fileWidth = firstFile.width;
    var fileHeight = firstFile.height;
    
    // Create a new document with default settings (change as needed)
    var doc = app.documents.add(fileWidth, fileHeight, 300, "Super Resolution", NewDocumentMode.RGB, undefined, undefined, BitsPerChannelType.SIXTEEN, "sRGB IEC61966-2.1");

    // Determine the total number of layers
    var totalLayers = fileDialog.length;

    // Loop through the selected files and load each image into a new layer
    for (var i = 0; i < totalLayers; i++) {
      var filePath = fileDialog[i].fsName;
      var fileRef = new File(filePath);

      if (fileRef.exists) {
        // Open the file
        var imageDoc = app.open(fileRef);

        // Ensure the opened image document is in RGB mode
        if (imageDoc.mode != DocumentMode.RGB) {
          // Convert the document to RGB mode
          imageDoc.changeMode(ChangeMode.RGB);
        }

        // Duplicate the opened document to the target document
        imageDoc.artLayers[0].duplicate(doc, ElementPlacement.PLACEATEND);

        // Ensure the new document is the active one
        app.activeDocument = doc;

        // Calculate the opacity based on layer order
        var opacity = (i + 1) / totalLayers * 100;
        doc.layers[i].opacity = opacity;
        app.activeDocument.activeLayer.name = "Opacity " + Math.round(opacity) + "%";

        // Close the opened document without saving changes
        imageDoc.close(SaveOptions.DONOTSAVECHANGES);
      } else {
        alert("File not found: " + filePath);
      }
    }

    // Flatten the layers if desired
    // doc.flatten();

  } else {
    alert("No files selected. Script canceled.");
  } 
} catch (e) {
  alert("An error occurred: " + e);
}

