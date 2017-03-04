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
    * [.removePanel(clickedLabel)](#ax5docker.removePanel) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.appendPanel(_panel, _appendPath, _appendType)](#ax5docker.appendPanel) ⇒ <code>[ax5docker](#ax5docker)</code>
    * [.align()](#ax5docker.align) ⇒ <code>[ax5docker](#ax5docker)</code>

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

| Param | Type | Default |
| --- | --- | --- |
| config | <code>Object</code> |  | 
| config.target | <code>Element</code> |  | 
| config.panels | <code>Array</code> |  | 
| [config.icons] | <code>Object</code> |  | 
| [config.icons.close] | <code>String</code> |  | 
| [config.icons.more] | <code>String</code> |  | 
| [config.disableClosePanel] | <code>Boolean</code> | <code>false</code> | 
| [config.disableDragPanel] | <code>Boolean</code> | <code>false</code> | 
| [config.control] | <code>Object</code> |  | 
| [config.control.before] | <code>function</code> |  | 
| [config.control.after] | <code>function</code> |  | 
| [config.menu] | <code>Object</code> |  | 
| [config.menu.theme] | <code>String</code> | <code>&quot;default&quot;</code> | 
| [config.menu.position] | <code>String</code> | <code>&quot;absolute&quot;</code> | 
| [config.menu.icons] | <code>Object</code> |  | 
| [config.menu.icons.arrow] | <code>String</code> |  | 
| [config.resizeDebounceTime] | <code>Number</code> | <code>100</code> | 
| [config.panelDebounceTime] | <code>Number</code> | <code>300</code> | 

**Example**  
```js
var myDocker = new ax5.ui.docker();
myDocker.setConfig({
     target: $('[data-ax5docker="docker1"]'),
     panels: [
         {
             type: "panel",
             name: "panel name",
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

### ax5docker.removePanel(clickedLabel) ⇒ <code>[ax5docker](#ax5docker)</code>
패널 삭제하기

**Kind**: static method of <code>[ax5docker](#ax5docker)</code>  

| Param |
| --- |
| clickedLabel | 

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
