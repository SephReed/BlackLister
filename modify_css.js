//Seph Reed Copywrite
//January 2014
//This code retrieves the color codes for specific parts and them applies
//them to all elements listed under that part in elements_and_settings.json

///---------Include list_tools.js------------------------------
function Link(url)  {
   this.url = url;
   this.hits = 0;
}


function findMatchingLink(url, list) {
    var target = findMatchingLinkIndex(url, list);
    if(target != -1)  {  return list[target];  }
    else return null;
}   

function findMatchingLinkIndex(url, list) {
    if(list == null)  { return -1; }
    
    for (var i = 0; i < list.length; i++)  {
        if(checkUrlForListItem(url, list[i].url) == true) {
            return i;  
        }
    }   
    return -1;
} 

function checkUrlForListItem(url, itemText) {
    var target_index = url.indexOf(itemText);

    //if the list url is found in this link
    if(target_index != -1) {

        //if it begins the link, good
        if(target_index == 0)
            return true;

        //if it is not prepended by a letter, character, or dash, it's not part of the domain name, good
        else {
            var prev_char = url.charAt(target_index - 1);
            var matches = prev_char.match(/[\w\n-]/g);
            if(matches == null)
                return true;
        }
    }  

    return false;
}


function removeMatchingLink(url, list) {
    var target = findMatchingLinkIndex(url, list);
    if(target != -1)  {  list.splice(target, 1);   return true;  }
    return false;
}   
///---------------------------------------------------------------



var currentlyDuckDuckGo = false;//checkUrlForListItem(document.URL, "duckduckgo.");



var black_list;
var a_list;


browser.storage.local.get('black_list', function(result){
    if(result.black_list != null)  {  
        black_list = result.black_list;  }
    else {  black_list = ["microsoft.", "w3schools.", "jquery.", "facebook."];  }

    if(findMatchingLinkIndex(document.URL, black_list) != -1) {
        nukePage();
    }

    applyList(black_list, "bad_link");
});


browser.storage.local.get('a_list', function(result){
    if(result.a_list != null)  {  
        a_list = result.a_list;  }
    else {  a_list = ["wikipedia.", "css-tricks.", "lifehacker.", "mozilla."];  }

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
                            // console.log(newNodes[i].nodeName.charAt(0));
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




function modLinks(nodeTree, list, className) {
        //
    var links = nodeTree.getElementsByTagName('a');

    if(links != undefined)  {
        for(var i = 0; i < links.length; i++)  {
            var link = links[i];

            for(var j = 0; j < list.length; j++) {
                    //


                // if(link.href.indexOf(list[j].url) != -1) {
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
    }
}




var nuke;

function nukePage()  {
    console.log("hi");

    if(nuke === undefined) {
        nuke = document.createElement('div');
        nuke.id = "nuke_overlay";

        var nukeImage = document.createElement('div');
        nukeImage.id = "nuke_image";

        var blammedText = document.createElement('div');
        blammedText.id = "page_blammed_textbox";
        blammedText.innerHTML = "BLAMMED!<br>You should probably go to a different site<br>";
        // blammedText.innerHTML += "<input type = 'button' value = 'View Anyways' onClick = 'clearNuke()'>";

        var viewAnyways = document.createElement('button');
        viewAnyways.id = "view_anyways";
        viewAnyways.innerHTML = "View Anyways";
        // viewAnyways.onClick = clearNuke;

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















