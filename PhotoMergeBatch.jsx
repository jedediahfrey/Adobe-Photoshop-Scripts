var runphotomergeFromScript = true; // must be before Photomerge include
//@includepath "/Applications/Adobe Photoshop CS5/Presets/Scripts/"
//@includepath "/c/Program Files (x86)/Adobe/Adobe Photoshop CS5/Presets/Scripts/"
//@includepath "/c/Program Files/Adobe/Adobe Photoshop CS5/Presets/Scripts/"
//@include "Photomerge.jsx"
//@show include
var psdOpts = new PhotoshopSaveOptions();
psdOpts.embedColorProfile = true;
psdOpts.alphaChannels = true;
psdOpts.layers = true;

var jpegOptions = new JPEGSaveOptions();
jpegOptions.quality=12;
jpegOptions.scans=5;

var workFolder = Folder.selectDialog();
parseFolder(workFolder);

function parseFolder(folder) {
	var folders = folder.getFiles( function( file ) { return file instanceof Folder; } );
	var jpg= folder.getFiles("*.jpg");
	var dng= folder.getFiles("*.dng");
	var cr2= folder.getFiles("*.CR2");
	var files=jpg.concat(dng, cr2);
	for(var i = 0; i < folders.length; i++ ) {
		try {
			parseFolder(folders[i]);
		} catch(err) {
		}
	}
	if (files.length>0) {
		try {
			mergeImages(files);
		} catch (err) {
			alert(err);
		}
	}
}

function mergeImages(fList) {
	var alignmentKeys=Array("Prsp","cylindrical","spherical","sceneCollage","translation");
	for (var j=0; j< alignmentKeys.length; j++) {
		// override Photomerge.jsx settings. Default is "Auto". Uncomment to override the default.
		photomerge.alignmentKey=alignmentKeys[j];
		//photomerge.alignmentKey   = "Auto";
		photomerge.alignmentKey   = "Prsp";
		photomerge.alignmentKey   = "cylindrical";
		photomerge.alignmentKey   = "spherical";
		photomerge.alignmentKey   = "sceneCollage";
		photomerge.alignmentKey   = "translation"; // "Reposition" in layout dialog
		// other setting that may need to be changed. Defaults below
		photomerge.advancedBlending      = true; // 'Bend Images Together' checkbox in dialog
		photomerge.lensCorrection      = true; // Geometric Distortion Correction'checkbox in dialog
		photomerge.removeVignette      = true; // 'Vignette Removal' checkbox in dialog
		if( fList.length >  0) {
			photomerge.createPanorama(fList,false);
		}
		// The merged doc will be the activeDocument
		activeDocument.saveAs( new File( fList[0].parent +"." + alignmentKeys[j] + '.psd' ) , psdOpts,     true, Extension.LOWERCASE);
		activeDocument.saveAs( new File( fList[0].parent +"." + alignmentKeys[j] + '.jpg' ) , jpegOptions, true, Extension.LOWERCASE);
		activeDocument.close( SaveOptions.DONOTSAVECHANGES );
	}
}
