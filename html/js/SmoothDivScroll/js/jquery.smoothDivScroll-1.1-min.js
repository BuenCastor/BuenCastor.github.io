/*
* jQuery SmoothDivScroll 1.1
*
* Copyright (c) 2010 Thomas Kahn
* Licensed under the GPL license.
*
* http://www.maaki.com/thomas/SmoothDivScroll/
*
* Depends:
* jquery.ui.widget.js
*
*/
(function($){$.widget("thomaskahn.smoothDivScroll",{options:{scrollingHotSpotLeft:"div.scrollingHotSpotLeft",scrollingHotSpotRight:"div.scrollingHotSpotRight",scrollableArea:"div.scrollableArea",scrollWrapper:"div.scrollWrapper",hiddenOnStart:false,ajaxContentURL:"",countOnlyClass:"",scrollStep:15,scrollInterval:10,mouseDownSpeedBooster:3,autoScroll:"",autoScrollDirection:"right",autoScrollStep:5,autoScrollInterval:10,visibleHotSpots:"",hotSpotsVisibleTime:5,startAtElementId:""},_create:function(){var self=this,o=this.options,el=this.element;el.data("scrollWrapper",el.find(o.scrollWrapper));el.data("scrollingHotSpotRight",el.find(o.scrollingHotSpotRight));el.data("scrollingHotSpotLeft",el.find(o.scrollingHotSpotLeft));el.data("scrollableArea",el.find(o.scrollableArea));el.data("speedBooster",1);el.data("motherElementOffset",el.offset().left);el.data("scrollXPos",0);el.data("hotSpotWidth",el.find(o.scrollingHotSpotLeft).width());el.data("scrollableAreaWidth",0);el.data("startingPosition",0);el.data("rightScrollInterval",null);el.data("leftScrollInterval",null);el.data("autoScrollInterval",null);el.data("hideHotSpotBackgroundsInterval",null);el.data("previousScrollLeft",0);el.data("pingPongDirection","right");el.data("getNextElementWidth",true);el.data("swapAt",null);el.data("startAtElementHasNotPassed",true);el.data("swappedElement",null);el.data("originalElements",el.data("scrollableArea").children(o.countOnlyClass));el.data("visible",true);el.data("initialAjaxContentLoaded",false);el.data("enabled",true);if(o.autoScroll!=="always"){switch(o.visibleHotSpots){case"always":self.showHotSpotBackgrounds();break;case"onstart":self.showHotSpotBackgrounds();el.data("hideHotSpotBackgroundsInterval",setTimeout(function(){self.hideHotSpotBackgrounds("slow")},(o.hotSpotsVisibleTime*1000)));break;default:break}}el.data("scrollingHotSpotRight").bind("mousemove",function(e){var x=e.pageX-(this.offsetLeft+el.data("motherElementOffset"));el.data("scrollXPos",Math.round((x/el.data("hotSpotWidth"))*o.scrollStep));if(el.data("scrollXPos")===Infinity){el.data("scrollXPos",0)}});el.data("scrollingHotSpotRight").bind("mouseover",function(){if((o.autoScroll==="onstart"&&el.data("autoScrollInterval")!==null)){clearInterval(el.data("autoScrollInterval"));el.data("autoScrollInterval",null);self._trigger("autoScrollIntervalStopped")}el.data("rightScrollInterval",setInterval(function(){if(el.data("scrollXPos")>0&&el.data("enabled")){el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+(el.data("scrollXPos")*el.data("speedBooster")));self._showHideHotSpots()}},o.scrollInterval));self._trigger("mouseOverRightHotSpot")});el.data("scrollingHotSpotRight").bind("mouseout",function(){clearInterval(el.data("rightScrollInterval"));el.data("scrollXPos",0)});el.data("scrollingHotSpotRight").bind("mousedown",function(){el.data("speedBooster",o.mouseDownSpeedBooster)});$("body").bind("mouseup",function(){el.data("speedBooster",1)});el.data("scrollingHotSpotLeft").bind("mousemove",function(e){var x=el.data("scrollingHotSpotLeft").innerWidth()-(e.pageX-el.data("motherElementOffset"));el.data("scrollXPos",Math.round((x/el.data("hotSpotWidth"))*o.scrollStep));if(el.data("scrollXPos")===Infinity){el.data("scrollXPos",0)}});el.data("scrollingHotSpotLeft").bind("mouseover",function(){if((o.autoScroll==="onstart"&&el.data("autoScrollInterval")!==null)){clearInterval(el.data("autoScrollInterval"));el.data("autoScrollInterval",null);self._trigger("autoScrollIntervalStopped")}el.data("leftScrollInterval",setInterval(function(){if(el.data("scrollXPos")>0&&el.data("enabled")){el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-(el.data("scrollXPos")*el.data("speedBooster")));self._showHideHotSpots()}},o.scrollInterval));self._trigger("mouseOverLeftHotSpot")});el.data("scrollingHotSpotLeft").bind("mouseout",function(){clearInterval(el.data("leftScrollInterval"));el.data("scrollXPos",0)});el.data("scrollingHotSpotLeft").bind("mousedown",function(){el.data("speedBooster",o.mouseDownSpeedBooster)});$(window).bind("resize",function(){if(!(o.hiddenOnStart)){self._showHideHotSpots()}self._trigger("windowResized")});if(o.ajaxContentURL.length>0){self.replaceContent(o.ajaxContentURL)}else{self.recalculateScrollableArea()}if(o.hiddenOnStart){self.hide()}if((o.autoScroll.length>0)&&!(o.hiddenOnStart)&&(o.ajaxContentURL.length<=0)){self.startAutoScroll()}},showHotSpotBackgrounds:function(fadeSpeed){var self=this,el=this.element;if(fadeSpeed!==undefined){el.data("scrollingHotSpotLeft").css("opacity","0.0");el.data("scrollingHotSpotRight").css("opacity","0.0");el.data("scrollingHotSpotLeft").addClass("scrollingHotSpotLeftVisible");el.data("scrollingHotSpotRight").addClass("scrollingHotSpotRightVisible");el.data("scrollingHotSpotLeft").fadeTo(fadeSpeed,0.35);el.data("scrollingHotSpotRight").fadeTo(fadeSpeed,0.35)}else{el.data("scrollingHotSpotLeft").addClass("scrollingHotSpotLeftVisible");el.data("scrollingHotSpotLeft").removeAttr("style");el.data("scrollingHotSpotRight").addClass("scrollingHotSpotRightVisible");el.data("scrollingHotSpotRight").removeAttr("style")}self._showHideHotSpots()},hideHotSpotBackgrounds:function(fadeSpeed){var el=this.element;if(fadeSpeed!==undefined){el.data("scrollingHotSpotLeft").fadeTo(fadeSpeed,0.0,function(){el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible")});el.data("scrollingHotSpotRight").fadeTo(fadeSpeed,0.0,function(){el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible")})}else{el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible");el.data("scrollingHotSpotLeft").removeAttr("style");el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible");el.data("scrollingHotSpotRight").removeAttr("style")}},_showHideHotSpots:function(){var self=this,el=this.element,o=this.options;if(o.autoScroll!=="always"){if(el.data("scrollableAreaWidth")<=(el.data("scrollWrapper").innerWidth())){el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").hide()}else if(el.data("scrollWrapper").scrollLeft()===0){el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").show();self._trigger("scrollLeftLimitReached");clearInterval(el.data("leftScrollInterval"));el.data("leftScrollInterval",null)}else if(el.data("scrollableAreaWidth")<=(el.data("scrollWrapper").innerWidth()+el.data("scrollWrapper").scrollLeft())){el.data("scrollingHotSpotLeft").show();el.data("scrollingHotSpotRight").hide();self._trigger("scrollRightLimitReached");clearInterval(el.data("rightScrollInterval"));el.data("rightScrollInterval",null)}else{el.data("scrollingHotSpotLeft").show();el.data("scrollingHotSpotRight").show()}}else{el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").hide()}},moveToElement:function(moveTo,elementNumber){var self=this,el=this.element,o=this.options,tempScrollableAreaWidth=0,foundStartAtElement=false;switch(moveTo){case"first":el.data("scrollXPos",0);self._trigger("movedToFirstElement");break;case"start":el.data("scrollableArea").children(o.countOnlyClass).each(function(){if((o.startAtElementId.length>0)&&(($(this).attr("id"))===o.startAtElementId)){el.data("startingPosition",tempScrollableAreaWidth);foundStartAtElement=true}tempScrollableAreaWidth=tempScrollableAreaWidth+$(this).outerWidth(true)});el.data("scrollXPos",el.data("startingPosition"));self._trigger("movedToStartElement");break;case"last":el.data("scrollXPos",el.data("scrollableAreaWidth"));self._trigger("movedToLastElement");break;case"number":if(!(isNaN(elementNumber))){el.data("scrollableArea").children(o.countOnlyClass).each(function(index){if(index===(elementNumber-1)){el.data("scrollXPos",tempScrollableAreaWidth)}tempScrollableAreaWidth=tempScrollableAreaWidth+$(this).outerWidth(true)})}self._trigger("movedToElementNumber",null,{"elementNumber":elementNumber});break;default:break}el.data("scrollWrapper").scrollLeft(el.data("scrollXPos"));self._showHideHotSpots()},addContent:function(ajaxContentURL,addWhere){var self=this,el=this.element;$.get(ajaxContentURL,function(data){if(addWhere==="first"){el.data("scrollableArea").children(":first").before(data)}else{el.data("scrollableArea").children(":last").after(data)}self.recalculateScrollableArea();self._showHideHotSpots()})},replaceContent:function(ajaxContentURL){var self=this,el=this.element;el.data("scrollableArea").load(ajaxContentURL,function(){self.recalculateScrollableArea();self.moveToElement("first");self._showHideHotSpots();el.data("startingPosition",0)})},recalculateScrollableArea:function(){var tempScrollableAreaWidth=0,foundStartAtElement=false,o=this.options,el=this.element,self=this;el.data("scrollableArea").children(o.countOnlyClass).each(function(){if((o.startAtElementId.length>0)&&(($(this).attr("id"))===o.startAtElementId)){el.data("startingPosition",tempScrollableAreaWidth);foundStartAtElement=true}tempScrollableAreaWidth=tempScrollableAreaWidth+$(this).outerWidth(true)});if(!(foundStartAtElement)){el.data("startAtElementId","")}el.data("scrollableAreaWidth",tempScrollableAreaWidth);el.data("scrollableArea").width(el.data("scrollableAreaWidth"));el.data("scrollWrapper").scrollLeft(el.data("startingPosition"));el.data("scrollXPos",el.data("startingPosition"));if(!(el.data("initialAjaxContentLoaded"))){if((o.autoScroll.length>0)&&!(o.hiddenOnStart)&&(o.ajaxContentURL.length>0)){self.startAutoScroll();el.data("initialAjaxContentLoaded",true)}}},stopAutoScroll:function(){var self=this,el=this.element;clearInterval(el.data("autoScrollInterval"));el.data("autoScrollInterval",null);self._showHideHotSpots();self._trigger("autoScrollStopped")},startAutoScroll:function(){var self=this,el=this.element,o=this.options;self._showHideHotSpots();clearInterval(el.data("autoScrollInterval"));el.data("autoScrollInterval",null);self._trigger("autoScrollStarted");el.data("autoScrollInterval",setInterval(function(){if(!(el.data("visible"))||(el.data("scrollableAreaWidth")<=(el.data("scrollWrapper").innerWidth()))){clearInterval(el.data("autoScrollInterval"));el.data("autoScrollInterval",null)}else{el.data("previousScrollLeft",el.data("scrollWrapper").scrollLeft());switch(o.autoScrollDirection){case"right":el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+o.autoScrollStep);if(el.data("previousScrollLeft")===el.data("scrollWrapper").scrollLeft()){self._trigger("autoScrollRightLimitReached");clearInterval(el.data("autoScrollInterval"));el.data("autoScrollInterval",null);self._trigger("autoScrollIntervalStopped")}break;case"left":el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-o.autoScrollStep);if(el.data("previousScrollLeft")===el.data("scrollWrapper").scrollLeft()){self._trigger("autoScrollLeftLimitReached");clearInterval(el.data("autoScrollInterval"));el.data("autoScrollInterval",null);self._trigger("autoScrollIntervalStopped")}break;case"backandforth":if(el.data("pingPongDirection")==="right"){el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+(o.autoScrollStep))}else{el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-(o.autoScrollStep))}if(el.data("previousScrollLeft")===el.data("scrollWrapper").scrollLeft()){if(el.data("pingPongDirection")==="right"){el.data("pingPongDirection","left");self._trigger("autoScrollRightLimitReached")}else{el.data("pingPongDirection","right");self._trigger("autoScrollLeftLimitReached")}}break;case"endlessloopright":if(el.data("getNextElementWidth")){if((o.startAtElementId.length>0)&&(el.data("startAtElementHasNotPassed"))){el.data("swapAt",$("#"+o.startAtElementId).outerWidth(true));el.data("startAtElementHasNotPassed",false)}else{el.data("swapAt",el.data("scrollableArea").children(":first").outerWidth(true))}el.data("getNextElementWidth",false)}el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+o.autoScrollStep);if(el.data("swapAt")<=el.data("scrollWrapper").scrollLeft()){el.data("swappedElement",el.data("scrollableArea").children(":first").detach());el.data("scrollableArea").append(el.data("swappedElement"));el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-el.data("swappedElement").outerWidth(true));el.data("getNextElementWidth",true)}break;case"endlessloopleft":if(el.data("getNextElementWidth")){if((o.startAtElementId.length>0)&&(el.data("startAtElementHasNotPassed"))){el.data("swapAt",$("#"+o.startAtElementId).outerWidth(true));el.data("startAtElementHasNotPassed",false)}else{el.data("swapAt",el.data("scrollableArea").children(":first").outerWidth(true))}el.data("getNextElementWidth",false)}el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-o.autoScrollStep);if(el.data("scrollWrapper").scrollLeft()===0){el.data("swappedElement",el.data("scrollableArea").children(":last").detach());el.data("scrollableArea").prepend(el.data("swappedElement"));el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+el.data("swappedElement").outerWidth(true));el.data("getNextElementWidth",true)}break;default:break}}},o.autoScrollInterval))},restoreOriginalElements:function(){var self=this,el=this.element;el.data("scrollableArea").html(el.data("originalElements"));self.recalculateScrollableArea();self.moveToElement("first")},show:function(){var el=this.element;el.data("visible",true);el.show()},hide:function(){var el=this.element;el.data("visible",false);el.hide()},enable:function(){var el=this.element;el.data("enabled",true)},disable:function(){var el=this.element;clearInterval(el.data("autoScrollInterval"));clearInterval(el.data("rightScrollInterval"));clearInterval(el.data("leftScrollInterval"));clearInterval(el.data("hideHotSpotBackgroundsInterval"));el.data("enabled",false)},destroy:function(){var el=this.element;clearInterval(el.data("autoScrollInterval"));clearInterval(el.data("rightScrollInterval"));clearInterval(el.data("leftScrollInterval"));clearInterval(el.data("hideHotSpotBackgroundsInterval"));el.data("scrollingHotSpotRight").unbind("mouseover");el.data("scrollingHotSpotRight").unbind("mouseout");el.data("scrollingHotSpotRight").unbind("mousedown");el.data("scrollingHotSpotLeft").unbind("mouseover");el.data("scrollingHotSpotLeft").unbind("mouseout");el.data("scrollingHotSpotLeft").unbind("mousedown");el.data("scrollableArea").html(el.data("originalElements"));el.data("scrollableArea").removeAttr("style");el.data("scrollingHotSpotRight").removeAttr("style");el.data("scrollingHotSpotLeft").removeAttr("style");el.data("scrollWrapper").scrollLeft(0);el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible");el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible");el.data("scrollingHotSpotRight").hide();el.data("scrollingHotSpotLeft").hide();$.Widget.prototype.destroy.apply(this,arguments)}})})(jQuery);
