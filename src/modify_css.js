//Seph Reed Copywrite
//January 2014
//This code retrieves the color codes for specific parts and them applies
//them to all elements listed under that part in elements_and_settings.json




var black_list;
var a_list;


browser.storage.local.get('black_list', function(result){
    if(result.black_list != null)  {  
        black_list = result.black_list;  }
    else {  
        black_list = ["msdn.microsoft.", "w3schools.", "jquery.", "facebook."].map(function(url) { return new Link(url)});  
        chrome.storage.local.set({ 'black_list' : black_list  }, function() {}); 
    }

    if(findMatchingLinkIndex(document.URL, black_list) != -1) {
        nukePage();
    }

    applyList(black_list, "bad_link");
});


browser.storage.local.get('a_list', function(result){
    if(result.a_list != null)  {  
        a_list = result.a_list;  }
    else {  
        a_list = ["wikipedia.", "css-tricks.", "lifehacker.", "mozilla."].map(function(url) { return new Link(url)});  
        chrome.storage.local.set({ 'a_list' : a_list  }, function() {}); 
    }

    applyList(a_list, "good_link");
});


function applyList(list, className)  {

    var current_site = document.URL;
    removeMatchingLink(current_site, list);


    var my_body_is_ready = setInterval(function(){
            //
        var body = document.getElementsByTagName('body');
        if(body != undefined) {
            clearInterval(my_body_is_ready);
            

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach ( function (mutation) {
                    var newNodes = mutation.addedNodes;

                    for(var i = 0; i < newNodes.length; i++) {
                        if(newNodes[i].nodeName.charAt(0) != "#")  {
                            modLinks(newNodes[i], list, className);

                    }   }
                });
            });

            var config = { childList: true, subtree: true };
            observer.observe(document.body, config);

            
            modLinks(document.body, list, className);   
        }
    }, 50);
}






function findParentWithClass(root, className) {
    if(root.classList.contains(className))
        return root;

    else if (root.parentNode != undefined)
        return findParentWithClass(root.parentNode, className);

    else return undefined;
}




function modLinks(root, list, className) {
        //
    var links = root.getElementsByTagName('a');

    for(var i = 0; links && i < links.length; i++) { 
        modLink(links[i], list, className);    
    }
}



var currentlyDuckDuckGo = false;//checkUrlForListItem(document.URL, "duckduckgo.");

function modLink(link, list, className) {
    if(!link || !link.href || link.classList.contains(className))
        return;

    for(var j = 0; j < list.length; j++) {
            //
        if(checkUrlForListItem(link.href, list[j].url) == true) {
            link.classList.add(className);
            j = list.length;

            if(currentlyDuckDuckGo && list == black_list) {
                var result = findParentWithClass(link, "result");
                if(result)
                    result.style.display = "none";
            }
        }
    }
}




var nuke;

function nukePage()  {
    if(nuke === undefined) {
        nuke = document.createElement('div');
        nuke.id = "nuke_overlay";

        var nukeImage = document.createElement('div');
        nukeImage.id = "nuke_image";

        var blammedText = document.createElement('div');
        blammedText.id = "page_blammed_textbox";
        blammedText.textContent = "BLAMMED!<br>You should probably go to a different site<br>";

        var viewAnyways = document.createElement('button');
        viewAnyways.id = "view_anyways";
        viewAnyways.textContent = "View Anyways";

        nuke.appendChild(nukeImage);
        nuke.appendChild(blammedText);
        blammedText.appendChild(viewAnyways);

        var buttons = nuke.getElementsByTagName("BUTTON");
        buttons[0].onclick = function() {  clearNuke();  }
    }

    var body = document.body;
    body.insertBefore(nuke, body.firstChild);   
}


function clearNuke() {  
    if(nuke !== undefined)
        nuke.parentNode.removeChild(nuke);
}



browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    console.log(request.updateBlam);
    if (request.updateBlam == true) {  
        nukePage();  }
    else if (request.updateBlam == false) {  
        clearNuke();  }
});















