var loadLayersFromScript = true; // must be before Photomerge include
//@includepath "/Applications/Adobe Photoshop CS5/Presets/Scripts/"
//@includepath "/c/Program Files (x86)/Adobe/Adobe Photoshop CS5/Presets/Scripts/"
//@includepath "/c/Program Files/Adobe/Adobe Photoshop CS5/Presets/Scripts/"
//@include "Load Files into Stack.jsx"
//@show include

var jpegOptions = new JPEGSaveOptions();
jpegOptions.quality=12;
jpegOptions.scans=5;
// Close all open documents.
while (app.documents.length) {
		app.activeDocument.close();
}
// Select input folder.
var workFolder = Folder.selectDialog();

// Recursively parse folder.
parseFolder(workFolder);

function parseFolder(folder) {
	var folders = folder.getFiles( function( file ) { return file instanceof Folder; } );
	var jpg= folder.getFiles("*.jpg");
	var dng= folder.getFiles("*.dng");
	var cr2= folder.getFiles("*.CR2");
	var files=jpg.concat(dng).concat(cr2);
	loadLayers.intoStack(files,true);
	if (files.length>0) {
			var folder=files[0].parent;
			exportChildren(activeDocument,folder);
	}
	activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	// Get all folders in working folder
	var folders = folder.getFiles( function( file ) { return file instanceof Folder; } );
		// For each folder, parse into folder.
		for(var i = 0; i < folders.length; i++ ) {
			try {
				parseFolder(folders[i]);
			} catch(err) {
			}
	}
}

function exportChildren(orgObj,folder) {
	for( var i = 0; i < orgObj.layers.length; i++) {
		orgObj.layers[i].visible = true;
		var layerName = orgObj.layers[i].name;  // store layer name before change doc
		var duppedDocumentTmp = orgObj.duplicate();
		duppedDocumentTmp.flatten();
		var saveFile = new File(folder + "/aligned_" + layerName);
		duppedDocumentTmp.saveAs(saveFile, jpegOptions, true, Extension.LOWERCASE);
		duppedDocumentTmp.close(SaveOptions.DONOTSAVECHANGES);
		orgObj.layers[i].visible = false;
	}
}
