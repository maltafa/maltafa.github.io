/**
 * Scripts.js (v1.0)
 *
 * (c) 1986 - 2018 Quark Software Inc.
 * All rights reserved.
 *
 */

/**
 *
 * Attach ResizeSensor (which uses ResizeObserver if supported) to all group boxes.
 *
 */
document.addEventListener('DOMContentLoaded', function () {
    var elements = document.getElementsByClassName("qx-group-box");

    for (var i = 0; i < elements.length; i++) {
        let element = elements[i];

        new ResizeSensor(element, function () {
            handleResize(element);
        });
        handleResize(element);
    }
}, false);

/**
 *
 * Handles the resize event to stretch or scale proportionally the content of the element.
 *
 */
function handleResize(element) {
    var baseWidth = parseFloat(element.getAttribute('data-base-width'));
    var baseHeight = parseFloat(element.getAttribute('data-base-height'));
    var maintainAR = (element.getAttribute('data-maintain-proportion') == 'true');

    if (baseWidth > 0 && baseHeight > 0 && element.clientWidth > 0) {
        if (maintainAR) {
            var ar = baseHeight/baseWidth;

            element.style.height = element.clientWidth * ar + 'px';
        }
        element.style.transformOrigin = '0 0';
        if (maintainAR) {
            element.style.transform = 'scale(' + element.clientWidth / baseWidth + ')';
        }
        else {
            element.style.transform = 'scaleX(' + element.clientWidth / baseWidth + ')';
        }
    }
};

function onHover(element) {
  var dataBack = element.getAttribute('data-hoverback');
  var dataFore = element.getAttribute('data-hoverfore');

  var elCollection = element.children;
  var bgClass = elCollection[0].getAttribute('class');
  var bgID = element.id;
  var idProps = bgID + '_Props';
  var bgFixedID = elCollection[0].id;
  if(bgFixedID === idProps)
  {
	elCollection[0].style.backgroundColor = dataBack;
	addHoverFg(element, dataFore);
  }
  if(bgClass === 'qx-box-bg') {
    elCollection[0].style.backgroundColor = dataBack;
    var attr = document.createAttribute('data-bgCandidate');
    attr.value = 'bgCandidate';
    elCollection[0].setAttributeNode(attr);
	addHoverFg(element, dataFore);
  }
  else {
    return;
  }
}

function addHoverFg(element, dataFore) {
  var index;
  var el = element.children;
  var childCount = element.childElementCount;
  for(index = 0; index < childCount; index++) {
    var bgClass = el[index].getAttribute('class');
    if(bgClass === 'qx-box-bg') {
      if(el[index].getAttribute('data-bgCandidate') === 'bgCandidate')
        continue;
      else
        return;
    }
    else {
      if(el[index].childElementCount > 0)
      addHoverFg(el[index], dataFore);
      else {
        var span = el[index].tagName;
        if(span === 'SPAN') {
          el[index].style.color = dataFore;
        }
      }
    }
  }
}

function onHoverLeave(element) {
  var elCollection = element.children;
  var bgClass = elCollection[0].getAttribute('class');
  var bgID = element.id;
  var idProps = bgID + '_Props';
  var bgFixedID = elCollection[0].id;
  if(bgFixedID === idProps)
  {
	elCollection[0].style.backgroundColor = '';
	removeHoverFg(element);
  }
  if(bgClass === 'qx-box-bg') {
    elCollection[0].style.backgroundColor = '';
    elCollection[0].removeAttribute('data-bgCandidate');
	removeHoverFg(element);
    }
  else {
    return;
  }
}

function removeHoverFg(element) {
  var index;
  var el = element.children;
  var childCount = element.childElementCount;
  for (index = 0; index < childCount; index++) {
      if (el[index].childElementCount > 0)
        removeHoverFg(el[index]);
      else {
        var span = el[index].tagName;
        if (span === 'SPAN') {
          el[index].style.color = '';
        }
    }
  }
}

/*
    Web Component: quark-popup
    Information: This web component is develop to show a generic popup window
    to host any embeded code, typically an iframe or some custom html fragments etc.
    In case it is hosting iframe, then it will also resize the iframe as required to
    fit it properly to make it responsive for different devices.
    Usage: 
        <quark-popup title="Appointment Booking" font-family="sans-serif" color="red">
        <iframe
        src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FKolkata&amp;src=YXJ1bjJiaGFydGlAZ21haWwuY29t&amp;src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;src=NGpvM2ZtbzF1NWYzazRrMjBxcnA4ZGczdGtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%234285F4&amp;color=%2333B679&amp;color=%23D50000&amp;color=%237986CB&amp;showTitle=1&amp;showNav=0&amp;showPrint=0&amp;showTabs=0&amp;title=Book%20an%20appointment"
        width="800"
        height="700"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        >Loading…</iframe
        >
    </quark-popup>
    Author: Arun Bharti
*/

quarkPopup = (function () {
    if (window.customElements.get("quark-popup")) return function () {};
    return function () {
      const template = document.createElement("template");
      template.innerHTML = `
  
  <div id="openButton"
      style="
          margin: 0px; 
          cursor: pointer; 
          width: 100%; 
          height: 100%;
          min-height: 50px;
  ">
  <div id="formWindow"
    style="
      display: none;
      background-color: white;
      position: fixed;
      top: 50%;
      left: 50%;
      border: 3px solid #f1f1f1;
      z-index: 9;
      min-width: 320px;
      filter: drop-shadow(1.41px 1.41px 5px rgba(31, 29, 32, 0.5));
    "
  >
  
  <div id="title"
      style="
          display: flex;
          flex-wrap: nowrap;
          height: 24 px;
          width: 100%;
          border-bottom: 1px solid rgba(100,100,100,.7);
          margin-bottom: 10px;
          background-color: rgb(230,230,230);
          cursor: default;
      ">
      <p id="titleString"
      style="
      width:100%;
      flex-grow:1;
      flex-shrink:1;
      text-align:center;
      margin:0px;
      align-self: center;
      user-select:none;
      ">
      </p>
      <p id="closeButton"
          type="button"
          style="
              font-size: 24px; 
              cursor: pointer; 
              position: relative; 
              margin: 0px;
              align-self: center;
              transform: rotate(45deg);
              user-select:none;
          "
      >
      +
    </p>
  </div>
    <!--****** REPLACE THIS iframe WITH YOUR iframe CODE *****-->
    <slot></slot>
  </div>`;
  
      class Popup extends HTMLElement {
        constructor() {
          super();
          this.render();
          this.formWindow = null;
          this.handler = null;
        }
  
        render() {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template.content.cloneNode(true));
          this.shadowRoot.querySelector(
            "#titleString"
          ).innerText = this.getAttribute("title");
          this.shadowRoot.querySelector(
            "#titleString"
          ).style.fontFamily = this.getAttribute("font-family");
          this.shadowRoot.querySelector(
            "#titleString"
          ).style.color = this.getAttribute("color");
        }
  
        connectedCallback() {
          this.shadowRoot
            .querySelector("#openButton")
            .addEventListener("click", (event) => this.openForm(event));
        }
  
        openForm(event) {
          if (this.addObjectToRoot()) {
            var element = this.formWindow;
            var iframe = element.querySelector("iframe");
            if (!(iframe instanceof HTMLElement)) {
              iframe = null;
            }
            //Let's just consider first iFrame...
            //though it can have more iframes :(
  
            var w = (window.innerWidth * 75) / 100;
            var elementWidth = parseInt(element.style.width, 10);
            if (w > elementWidth) {
              w = elementWidth;
            }
            element.style.maxWidth = w + "px";
            if (iframe) iframe.style.maxWidth = w + "px";
  
            var frameHeight = parseInt(element.offsetHeight, 10);
            var titleHeight = parseInt(
              element.querySelector("#title").offsetHeight,
              10
            );
            var finalHeight = frameHeight;
            var iframeHeight = frameHeight - titleHeight;
  
            var h = (window.innerHeight * 90) / 100;
            if (h < frameHeight) {
              finalHeight = h;
              iframeHeight = finalHeight - titleHeight;
            }
            element.style.maxHeight = frameHeight + "px";
            if (iframe) iframe.style.maxHeight = iframeHeight + "px";
  
            var efHeight = element.offsetHeight / 2;
            var efWidth = element.offsetWidth / 2;
            element.style.marginTop = "-" + efHeight + "px";
            element.style.marginLeft = "-" + efWidth + "px";
  
            this.formWindow
              .querySelector("#closeButton")
              .addEventListener("click", (event) => this.closeForm(event));
            document.addEventListener("keydown", (event) =>
              this.handleEscape(event)
            );
  
            var top = element.offsetTop;
            var left = element.offsetLeft;
            element.style.marginTop = 0 + "px";
            element.style.marginLeft = 0 + "px";
            element.style.top = top + "px";
            element.style.left = left + "px";
            this.handler = new handleDrag(
              this.formWindow.querySelector("#title"),
              element
            );
          }
        }
  
        handleEscape(e) {
          if (e.keyCode === 27) {
            // ESC
            this.closeForm(e);
          }
        }
  
        closeForm(event) {
          this.restObjectFromRoot();
          this.handler = null;
          event.stopPropagation();
        }
  
        slotContent(slot) {
          var frag = document.createDocumentFragment();
          var nodes = slot.assignedNodes({ flatten: true });
          for (let node of nodes) {
            frag.appendChild(node.cloneNode(true));
          }
          return frag;
        }
  
        flattenedCopy(sourceElement) {
          //Let's flatten the shadowDOM object and return it's clone
          var template = document.createElement("div");
          template.setAttribute("id", "codeHolder");
          template.appendChild(sourceElement.cloneNode(true));
          var slots = Array.from(sourceElement.querySelectorAll("slot"));
          var slots2 = Array.from(template.querySelectorAll("slot"));
          for (var i in slots) {
            var frag = this.slotContent(slots[i]);
            slots2[i].parentNode.replaceChild(frag, slots2[i]);
          }
          return template;
        }
  
        addObjectToRoot() {
          /*Let's remove form from normal flow and append it to the end of body
        to avoid a defect in HTML, where if any parent element has a filter(dropshadow) applied,
        then HTML creats a container around that and form could not be centerd in the screen
        gets clipped*/
  
          if (this.formWindow != null) return false;
  
          var element = this.shadowRoot.querySelector("#formWindow");
          this.formWindow = this.flattenedCopy(element).firstChild;
          this.formWindow.style.display = "block";
          if (this.formWindow.parentNode !== document.body) {
            document.body.appendChild(this.formWindow);
            // this.formWindow.querySelector("#closeButton").style.marginTop = "-10px";
          }
          return true;
        }
  
        restObjectFromRoot() {
          var element = this.formWindow;
          if (element == null) return;
          if (element.parentNode == document.body) {
            element.parentNode.removeChild(element);
            element.style.display = "none";
            this.formWindow = null;
          }
        }
      }
  
      class handleDrag {
        constructor(element, popup) {
          this.offset = { x: 0, y: 0 };
          this.element = element;
          this.popup = popup;
          this.clicked = function () {
            var e = window.event;
            var top = e.clientY - this.offset.y;
            var left = e.clientX - this.offset.x;
            this.popup.style.top = top + "px";
            this.popup.style.left = left + "px";
          };
          this.clickHandler = this.clicked.bind(this);
          this.element.addEventListener(
            "mousedown",
            (event) => this.mouseDown(event),
            false
          );
          window.addEventListener("mouseup", () => this.mouseUp(), false);
        }
  
        mouseUp() {
          window.removeEventListener("mousemove", this.clickHandler, true);
        }
  
        mouseDown(e) {
          this.offset.x = e.clientX - this.popup.offsetLeft;
          this.offset.y = e.clientY - this.popup.offsetTop;
          window.addEventListener("mousemove", this.clickHandler, true);
        }
      }
      window.customElements.define("quark-popup", Popup);
    };
  })();
  quarkPopup();
  