// ==UserScript==
// @name       Github Pull Request Reviewer by SPIDA
// @namespace  http://spidasoftware.com/
// @version    0.1
// @description  Give some order to your pull request
// @match      https://github.com/*/*/pull/*
// @match      https://github.com/*/*/pulls
// @match      https://github.com/spidasoftware/*
// @match      https://github.com/orgs/spidasoftware/dashboard/pulls
// @match      https://github.com/organizations/spidasoftware/dashboard/pulls/private
// @copyright  2013+, Jeremy Wentworth (SPIDAWeb)
// @require http://code.jquery.com/jquery-latest.js
// @require http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @require //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js
// @require https://raw.githubusercontent.com/andris9/jStorage/master/jstorage.js
// ==/UserScript==

var requestAnimationFrame = window.requestAnimationFrame;

$("#site-container").bind("DOMSubtreeModified", function() {
    $(".list-group-item-name").each(function(u, elementIterator){
        var reposLink = $(elementIterator).children().first().next();
        var pullLink = reposLink.next();
        reposLink.attr('href', pullLink.attr('href'));
    });
});

///////////////////////////////////////////////////////////////
// Style
///////////////////////////////////////////////////////////////
$(".container").width("93%");
$("#js-repo-pjax-container").width("80%");
$(".meta").css("padding","0px 10px");
$(".file").css("margin-bottom","3px");

///////////////////////////////////////////////////////////////
// DnD Sort
///////////////////////////////////////////////////////////////
$("#files").sortable({
    cursor: "move",
    handle: ".handle",
    start: function( event, ui ) {},
    stop: function( event, ui ) {
        $.jStorage.flush();
        $(".file.js-details-container").each(function(y, elementIterator){
            var updatedTempChild = $(elementIterator).children().first();
            var updatedDataPath = $(updatedTempChild).attr('data-path');
            $.jStorage.set(y, updatedDataPath);
        });
    }
});

///////////////////////////////////////////////////////////////
// Toggle data view for all files
///////////////////////////////////////////////////////////////
$('<a>',{
    text: 'Show Data',
    class: 'minibutton',
    style: 'margin-left:10px;',
    title: 'Show Data',
    href: '#',
    click: function(){ 
        $(".data").show()
    }
}).insertBefore($(".show-diff-stats"));

$('<a>',{
    text: 'Hide Data',
    class: 'minibutton',
    style: 'margin-left:10px;',
    title: 'File Data',
    href: '#',
    click: function(){ 
        $(".data").hide()
    }
}).insertBefore($(".show-diff-stats"));

///////////////////////////////////////////////////////////////
// Buttons for each file
///////////////////////////////////////////////////////////////
var bodyTag = $('body');
var filesContainer = $("#files");
$(".file").each(function(){
    var fileDiv = $(this);
    var actionsDiv = fileDiv.find(".actions");
    var dataDiv = fileDiv.find(".data");
    
    $('<a>',{
        text: 'Show',
        class: 'minibutton',
        style: '',
        title: 'Toggle',
        href: '#',
        click: function(){ 
            dataDiv.toggle();
            return false;
        }
    }).appendTo(actionsDiv);
    
    $('<a>',{
        text: 'Top',
        class: 'minibutton',
        style: '',
        title: 'Moves File to Top',
        href: '#',
        click: function(){ 
            fileDiv.detach(); 
            filesContainer.prepend(fileDiv);
            return false;
        }
    }).appendTo(actionsDiv);
    
    $('<a>',{
        text: 'Bottom',
        class: 'minibutton',
        style: '',
        title: 'Moves File to Bottom',
        href: '#',
        click: function(){ 
            fileDiv.detach(); 
            filesContainer.append(fileDiv);
            return false;
        }
    }).appendTo(actionsDiv);
 
    $('<div>',{
        text: '☰',
        class: 'handle',
        style: '',
        style: 'font-size:20px; display: inline-block; line-height:20px; padding-left:10px; cursor:move;'
    }).appendTo(actionsDiv);
    
});

    //Change "View" button to "Open" and now opens in new tab
    $(".minibutton.tooltipped.tooltipped-s").each(function(i, elementIterator){
            elementIterator.target = "_blank";
    });

requestAnimationFrame(function() {
    $(".minibutton.tooltipped.tooltipped-s").each(function(b, elementIterator){
        if(elementIterator.innerText === "View"){
            elementIterator.innerText = "Open";
        }
    });
});

    //Repository link doesn't open repository anymore, now opens pull request
$(".list-group-item-name").each(function(w, elementIterator){
    var reposLink = $(elementIterator).children().first().next();
    var pullLink = reposLink.next();
    reposLink.attr('href', pullLink.attr('href'));
});

//File location abbreviated
    var arrayOfLocations = [];
$(".js-selectable-text").each(function(m, elementIterator) {
    var stringLength = elementIterator.innerText.length;        
    if(stringLength > 48){
            var start = stringLength - 45;
            arrayOfLocations[m] = "..." + elementIterator.innerText.substring(start, stringLength);
        }
    else{
        arrayOfLocations[m] = elementIterator.innerText;
    }
});

requestAnimationFrame(function() {
    $(".js-selectable-text").each(function(v, elementIterator) {
        elementIterator.innerText = arrayOfLocations[v];
    });
});

//jStorage
function getIndex(node){
    var fileElementList = $("#files")[0];
    var childList = fileElementList.childNodes;
    var lengthOfFilesChildNodes = fileElementList.childNodes.length;
    var checkForId = false;
    var indexOfMatch = 0;
    var f = 0;
    while(!checkForId && f < lengthOfFilesChildNodes){ 
        if(node.id === childList[f].id){
            checkForId = true;
            indexOfMatch = f;
        }
       f++;
    }
    return indexOfMatch;
}

function jStorage(){
    var fileElement = $("#files")[0];
    $(".file.js-details-container").each(function(outerCounter, outerStorageIteration){
        $(".file.js-details-container").each(function(innerCounter, innerStorageIteration){
            var tempChild = $(innerStorageIteration).children().first();
            var dataPath = $(tempChild).attr('data-path');
            var value = $.jStorage.get(outerCounter);
            if(dataPath === value){
                var fileIndex = getIndex(innerStorageIteration);
                var tempNode = fileElement.removeChild(fileElement.childNodes[fileIndex]);
                fileElement.appendChild(tempNode);
        }
    });
});
}
requestAnimationFrame(jStorage);