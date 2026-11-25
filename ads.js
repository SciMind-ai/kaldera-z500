/* Adsterra: paste your own code from your Adsterra dashboard here.
   Leave the values empty and no ad is loaded. */
(function(){
 var BANNER_SCRIPT_URL=""; // e.g. the "src" of your Adsterra banner script
 var BANNER_OPTIONS_JS=""; // optional: the atOptions block, as a string
 var box=document.getElementById('ad-banner');
 if(!box||!BANNER_SCRIPT_URL)return;
 if(BANNER_OPTIONS_JS){var o=document.createElement('script');o.text=BANNER_OPTIONS_JS;box.appendChild(o)}
 var s=document.createElement('script');s.async=true;s.src=BANNER_SCRIPT_URL;box.appendChild(s);
})();
