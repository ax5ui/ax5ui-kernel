<a name="ax5docker"></a>

## ax5docker
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5docker](#ax5docker)
    * [.config](#ax5docker.config) : <code>Object</code>
    * [.xvar](#ax5docker.xvar) : <code>Object</code>
    * [.menu](#ax5docker.menu) : <code>Object</code>
    * [.panels](#ax5docker.panels) : <code>Array</code>
    * [.panelId](#ax5docker.panelId) : <code>Number</code>
    * [.modules](#ax5docker.modules) : <code>Object</code>
    * [.setConfig(config)](#ax5docker.setConfig)
    * [.setPanels()](#ax5docker.setPanels) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.addModule(modules)](#ax5docker.addModule) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.repaint()](#ax5docker.repaint) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.addPanel(_addPath, _addType, _panel, _panelIndex)](#ax5docker.addPanel) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.removePanel(panelPath, callback)](#ax5docker.removePanel) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.appendPanel(_panel, _appendPath, _appendType)](#ax5docker.appendPanel) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.align()](#ax5docker.align) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.searchPanel(_condition)](#ax5docker.searchPanel) ⇒ <code>\*</code>
    * [.activePanel(_panelPath, callback)](#ax5docker.activePanel) ⇒ <code>[ax5docker](#ax5docker)</code>

<a name="ax5docker.config"></a>

### ax5docker.config : <code>Object</code>
**Kind**: static property of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.xvar"></a>

### ax5docker.xvar : <code>Object</code>
**Kind**: static property of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.menu"></a>

### ax5docker.menu : <code>Object</code>
**Kind**: static property of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.panels"></a>

### ax5docker.panels : <code>Array</code>
**Kind**: static property of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.panelId"></a>

### ax5docker.panelId : <code>Number</code>
**Kind**: static property of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.modules"></a>

### ax5docker.modules : <code>Object</code>
**Kind**: static property of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.setConfig"></a>

### ax5docker.setConfig(config)
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  |  |
| config.target | <code>Element</code> |  |  |
| config.panels | <code>Array.&lt;Object&gt;</code> |  |  |
| config.panels[].type | <code>String</code> |  | panel, stack, row, column |
| config.panels[].name | <code>String</code> |  |  |
| [config.panels[].color] | <code>String</code> |  |  |
| [config.panels[].borderColor] | <code>String</code> |  |  |
| config.panels[].moduleName | <code>String</code> |  |  |
| config.panels[].moduleState | <code>Object</code> |  |  |
| config.panels[].panels | <code>Array.&lt;Object&gt;</code> |  |  |
| [config.icons] | <code>Object</code> |  |  |
| [config.icons.close] | <code>String</code> |  |  |
| [config.icons.more] | <code>String</code> |  |  |
| [config.disableClosePanel] | <code>Boolean</code> | <code>false</code> |  |
| [config.disableDragPanel] | <code>Boolean</code> | <code>false</code> |  |
| [config.control] | <code>Object</code> |  |  |
| [config.control.before] | <code>function</code> |  |  |
| [config.control.after] | <code>function</code> |  |  |
| [config.menu] | <code>Object</code> |  |  |
| [config.menu.theme] | <code>String</code> | <code>&quot;default&quot;</code> |  |
| [config.menu.position] | <code>String</code> | <code>&quot;absolute&quot;</code> |  |
| [config.menu.icons] | <code>Object</code> |  |  |
| [config.menu.icons.arrow] | <code>String</code> |  |  |
| [config.resizeDebounceTime] | <code>Number</code> | <code>100</code> |  |
| [config.panelDebounceTime] | <code>Number</code> | <code>300</code> |  |

**Example**  
```js
var myDocker = new ax5.ui.docker();
myDocker.setConfig({
     target: $('[data-ax5docker="docker1"]'),
     panels: [
         {
             type: "panel",
             name: "panel name",
             color: "#ff3300",
             borderColor: "#000000",
             moduleName: "content",
             moduleState:{
                 data: "data1"
             }
         }
     ]
});
```
<a name="ax5docker.setPanels"></a>

### ax5docker.setPanels() ⇒ <code>[ax5docker](#ax5docker)</code>
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.addModule"></a>

### ax5docker.addModule(modules) ⇒ <code>[ax5docker](#ax5docker)</code>
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param |
| --- |
| modules | 

<a name="ax5docker.repaint"></a>

### ax5docker.repaint() ⇒ <code>[ax5docker](#ax5docker)</code>
repaint panels of docker

**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.addPanel"></a>

### ax5docker.addPanel(_addPath, _addType, _panel, _panelIndex) ⇒ <code>[ax5docker](#ax5docker)</code>
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _addPath | <code>String</code> | Position path to add panel |
| _addType |  |  |
| _panel |  |  |
| _panelIndex |  |  |

**Example**  
```js
myDocker.addPanel('0.1', 'stack', {type:'panel', name:'addPanel', moduleName: 'content'});

```
<a name="ax5docker.removePanel"></a>

### ax5docker.removePanel(panelPath, callback) ⇒ <code>[ax5docker](#ax5docker)</code>
패널 삭제하기

**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param | Type |
| --- | --- |
| panelPath | <code>String</code> | 
| callback | <code>function</code> | 

**Example**  
```js
function removePanel() {
     var p = myDocker.searchPanel(function (panel) {
         return (panel.key == "A");
     });

     if (p) {
         myDocker.removePanel(p.panelPath, function () {
             removePanel();
         });
     }
}
removePanel();
```
<a name="ax5docker.appendPanel"></a>

### ax5docker.appendPanel(_panel, _appendPath, _appendType) ⇒ <code>[ax5docker](#ax5docker)</code>
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param |
| --- |
| _panel | 
| _appendPath | 
| _appendType | 

<a name="ax5docker.align"></a>

### ax5docker.align() ⇒ <code>[ax5docker](#ax5docker)</code>
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  
<a name="ax5docker.searchPanel"></a>

### ax5docker.searchPanel(_condition) ⇒ <code>\*</code>
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param |
| --- |
| _condition | 

**Example**  
```js
var p = myDocker.searchPanel(function (panel) {
 return (panel.id == "A");
});
```
<a name="ax5docker.activePanel"></a>

### ax5docker.activePanel(_panelPath, callback) ⇒ <code>[ax5docker](#ax5docker)</code>
**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param | Type |
| --- | --- |
| _panelPath | <code>String</code> | 
| callback | <code>function</code> | 

**Example**  
```js
myDocker.activePanel("0.1");
myDocker.activePanel("0.0.1");
```
