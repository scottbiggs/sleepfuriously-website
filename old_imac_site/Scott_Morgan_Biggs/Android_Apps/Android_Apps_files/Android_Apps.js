// Created by iWeb 3.0.3 local-build-20111014

setTransparentGifURL('../Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({reflection_0:new IWReflection({opacity:0.50,offset:1.00})});registry.applyEffects();}
function hostedOnDM()
{return false;}
function photocastSubscribe()
{photocastHelper("http://sleepfuriously.com/Scott_Morgan_Biggs/Android_Apps/rss.xml");}
function onPageLoad()
{loadMozillaCSS('Android_Apps_files/Android_AppsMoz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');detectBrowser();adjustLineHeightIfTooBig('id3');adjustFontSizeIfTooBig('id3');Widget.onload();fixupAllIEPNGBGs();fixAllIEPNGs('../Media/transparent.gif');applyEffects()}
function onPageUnload()
{Widget.onunload();}
