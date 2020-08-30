// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This extension demonstrates using chrome.downloads.download() to
// download URLs.

var allLinks = [];
var visibleLinks = [];

// Display all visible links.
function showLinks() {
  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }
  for (var i = 0; i < visibleLinks.length; ++i) {
    var row = document.createElement('tr');
    var col0 = document.createElement('td');
    var col1 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.checked = true;
    checkbox.type = 'checkbox';
    checkbox.id = 'check' + i;
    col0.appendChild(checkbox);
    col1.innerText = visibleLinks[i];
    col1.style.whiteSpace = 'nowrap';
    col1.onclick = function() {
      checkbox.checked = !checkbox.checked;
    }
    row.appendChild(col0);
    row.appendChild(col1);
    linksTable.appendChild(row);
  }
}

// Toggle the checked state of all visible links.
function toggleAll() {
  var checked = document.getElementById('toggle_all').checked;
  for (var i = 0; i < visibleLinks.length; ++i) {
    document.getElementById('check' + i).checked = checked;
  }
}

// Download all visible checked links .pdf
function downloadCheckedLinksPdf() {
    var pending = 0; // closure var
    for (var i = 0; i < visibleLinks.length; ++i) {
        if (document.getElementById('check' + i).checked) {
            pending = pending + 1;   
            var linkbib = visibleLinks[i];
            if (!linkbib.toLowerCase().endsWith(".pdf")) {
              linkbib = linkbib + ".pdf";
            }
            chrome.downloads.download({url: linkbib}, function(id) {
                var notification = window.webkitNotifications.createNotification('',
                               'OMG', 'hello within for loop, succeed!');
                notification.show();
                pending = pending - 1;
                if (pending <1) {
                   window.close();
                }
            });
        }
    }
}

// Download all visible checked links .bib
function downloadCheckedLinksBib() {
    var pending = 0; // closure var
    for (var i = 0; i < visibleLinks.length; ++i) {
        if (document.getElementById('check' + i).checked) {
            pending = pending + 1;       
            var linkbib = visibleLinks[i];
            if (linkbib.toLowerCase().endsWith(".pdf")) {
              linkbib = linkbib.replace(".pdf",".bib");
            } else {
              linkbib = linkbib + ".bib";
            }
            chrome.downloads.download({url: linkbib}, function(id) {
                var notification = window.webkitNotifications.createNotification('',
                               'OMG', 'hello within for loop, succeed!');
                notification.show();
                pending = pending - 1;
                if (pending <1) {
                   window.close();
                }
            });
        }
    }
}

// Download all visible checked links .xml
function downloadCheckedLinksXml() {
    var pending = 0; // closure var
    for (var i = 0; i < visibleLinks.length; ++i) {
        if (document.getElementById('check' + i).checked) {
            pending = pending + 1;       
            var linkbib = visibleLinks[i];
            if (linkbib.toLowerCase().endsWith(".pdf")) {
              linkbib = linkbib.replace(".pdf",".xml");
            } else {
              linkbib = linkbib + ".xml";
            }
            chrome.downloads.download({url: linkbib}, function(id) {
                var notification = window.webkitNotifications.createNotification('',
                               'OMG', 'hello within for loop, succeed!');
                notification.show();
                pending = pending - 1;
                if (pending <1) {
                   window.close();
                }
            });
        }
    }
}

// Download all visible checked links .endf
function downloadCheckedLinksEndf() {
    var pending = 0; // closure var
    for (var i = 0; i < visibleLinks.length; ++i) {
        if (document.getElementById('check' + i).checked) {
            pending = pending + 1;       
            var linkbib = visibleLinks[i];
            if (linkbib.toLowerCase().endsWith(".pdf")) {
              linkbib = linkbib.replace(".pdf",".endf");
            } else {
              linkbib = linkbib + ".endf";
            }
            chrome.downloads.download({url: linkbib}, function(id) {
                var notification = window.webkitNotifications.createNotification('',
                               'OMG', 'hello within for loop, succeed!');
                notification.show();
                pending = pending - 1;
                if (pending <1) {
                   window.close();
                }
            });
        }
    }
}

// Re-filter allLinks into visibleLinks and reshow visibleLinks.
function filterLinks() {
  var filterValue = document.getElementById('filter').value;
  if (document.getElementById('regex').checked) {
    visibleLinks = allLinks.filter(function(link) {
      return link.match(filterValue);
    });
  } else {
    var terms = filterValue.split(' ');
    visibleLinks = allLinks.filter(function(link) {
      for (var termI = 0; termI < terms.length; ++termI) {
        var term = terms[termI];
        if (term.length != 0) {
          var expected = (term[0] != '-');
          if (!expected) {
            term = term.substr(1);
            if (term.length == 0) {
              continue;
            }
          }
          var found = (-1 !== link.indexOf(term));
          if (found != expected) {
            return false;
          }
        }
      }
      return true;
    });
  }
  showLinks();
}

// Add links to allLinks and visibleLinks, sort and show them.  send_links.js is
// injected into all frames of the active tab, so this listener may be called
// multiple times.
chrome.extension.onRequest.addListener(function(links) {
  for (var index in links) {
    allLinks.push(links[index]);
  }
  allLinks.sort();
  visibleLinks = allLinks;
  showLinks();
});

// Set up event handlers and inject send_links.js into all frames in the active
// tab.
window.onload = function() {
  document.getElementById('filter').onkeyup = filterLinks;
  document.getElementById('regex').onchange = filterLinks;
  document.getElementById('toggle_all').onchange = toggleAll;
  document.getElementById('downloadpdf0').onclick = downloadCheckedLinksPdf;
  document.getElementById('downloadpdf1').onclick = downloadCheckedLinksPdf;
  document.getElementById('downloadbib0').onclick = downloadCheckedLinksBib;
  document.getElementById('downloadbib1').onclick = downloadCheckedLinksBib;
  document.getElementById('downloadxml0').onclick = downloadCheckedLinksXml;
  document.getElementById('downloadxml1').onclick = downloadCheckedLinksXml;
  document.getElementById('downloadendf0').onclick = downloadCheckedLinksEndf;
  document.getElementById('downloadendf1').onclick = downloadCheckedLinksEndf;

  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'js/send_links.js', allFrames: true});
    });
  });
};
