﻿// ------------------------------------------
// LOADING MASK MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'loadingMaskManager', sharedModules: ['pageElements'], plugins: ['helper'], hasEvents: true, isShared: true }, function () {
    var loadingMaskManager  = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        el                  = this.getSharedModule('pageElements'),
        helper              = this.getPlugin('helper'),
        loadingText         = null,
        masks               = {};


    // Define the loading mask text.
    loadingText = $(el.loadingText);

    // Define all the available masks.
    masks.ajax = {
        name    : 'ajax',
        enabled : true,
        el      : el.loadingMask
    };

    masks.analysis = {
        name    : 'analysis',
        enabled : true,
        el      : el.chartLoadingMask
    };
    
    masks['default'] = masks.ajax;

    $(el.loadingMask).click(function(){
        hide('ajax');
    });

    $(el.chartLoadingMask).click(function(){
        hide('analysis');
    });

    /* ----------------------- ON/OFF ----------------------- /

    function showAnalysisMask(fade) {

    }

    function hideAnalysisMask(fade) {
    
    }

    function showAjaxMask() {

    }

    function hideAjaxMask() {

    }

    // ------------------------------------------------------ */
    
    function show(type /* TODO: fade */) {
        var mask = masks[type || 'default'] || null;

        if (mask && mask.enabled) {
            $(mask.el).hide();
            $(mask.el).show();
        }
    }

    function hide(type /* TODO: fade */) {
        var mask = masks[type || 'default'] || null;

        if (mask) {
            $(mask.el).css("display", "none");
        }
    }
    
    function updateAnalysisText(text) {
        loadingText.html(text);
    }

    // TODO: Add code to prevent showing of any masks and or to enable/disable them.
    loadingMaskManager.show = show;
    loadingMaskManager.hide = hide;
    loadingMaskManager.updateAnalysisText = updateAnalysisText;

    return loadingMaskManager;
});