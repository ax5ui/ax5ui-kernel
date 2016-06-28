<a name="ax5combobox"></a>

## ax5combobox
**Kind**: global class  
**Version**: 0.1.0  
**Author:** tom@axisj.com  

* [ax5combobox](#ax5combobox)
    * [.setConfig(config)](#ax5combobox.setConfig) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.bind(item)](#ax5combobox.bind) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.open(boundID, [tryCount])](#ax5combobox.open) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.update(item)](#ax5combobox.update) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.val(boundID, [value], [Selected])](#ax5combobox.val) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.close()](#ax5combobox.close) ⇒ <code>[ax5combobox](#ax5combobox)</code>

<a name="ax5combobox.setConfig"></a>

### ax5combobox.setConfig(config) ⇒ <code>[ax5combobox](#ax5combobox)</code>
Preferences of combobox UI

**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | 클래스 속성값 |

**Example**  
```
```
<a name="ax5combobox.bind"></a>

### ax5combobox.bind(item) ⇒ <code>[ax5combobox](#ax5combobox)</code>
bind combobox

**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 
| [item.id] | <code>String</code> | 
| [item.theme] | <code>String</code> | 
| [item.multiple] | <code>Boolean</code> | 
| item.target | <code>Element</code> | 
| item.options | <code>Array.&lt;Object&gt;</code> | 

<a name="ax5combobox.open"></a>

### ax5combobox.open(boundID, [tryCount]) ⇒ <code>[ax5combobox](#ax5combobox)</code>
open the optionBox of combobox

**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| boundID | <code>String</code> &#124; <code>Number</code> &#124; <code>Element</code> | 
| [tryCount] | <code>Number</code> | 

<a name="ax5combobox.update"></a>

### ax5combobox.update(item) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| item | <code>Object</code> &#124; <code>String</code> | 

<a name="ax5combobox.val"></a>

### ax5combobox.val(boundID, [value], [Selected]) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| boundID | <code>String</code> &#124; <code>Number</code> &#124; <code>Element</code> | 
| [value] | <code>String</code> &#124; <code>Object</code> &#124; <code>Array</code> | 
| [Selected] | <code>Boolean</code> | 

<a name="ax5combobox.close"></a>

### ax5combobox.close() ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  
