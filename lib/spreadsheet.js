/**
 * License
 *
 *(The MIT License)
 *
 * Copyright (c) 2011 Anton Podviaznikov <podviaznikov@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
"use strict";
Object.defineProperty(Object.prototype,
    // Implement extend for easy prototypal inheritance
    'extends',
    {
        value: function extend(obj)
        {
            this.prototype.__proto__ = obj.prototype;
        }
    }
);
var spreadsheetJs={};
function buildFile(workbook,sheet)
{
    var file = new JSZip();
    var xl = file.folder('xl');
    xl.add('workbook.xml',workbook.toXML());
    var worksheets=xl.folder('worksheets');
    worksheets.add('sheet1.xml',sheet.toXML());
    var content = file.generate();
    return content;
};
var XML=Object.create({},
{
    meta:
    {
        value:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    },
    startTag:
    {
        value:'<'
    },
    endTag:
    {
        value:'>'
    },
    equalSign:
    {
        value:'='
    },
    whitespace:
    {
        value:' '
    },
    single_quote:
    {
        value:"'"
    },
    slash:
    {
        value:"/"
    }
});
var ValueEntity=function(){};
Object.defineProperties(ValueEntity.prototype,
{
    toXML:
    {
        value:function()
        {
            var xml= XML.startTag+this.tagName+XML.endTag;
            xml+=this.value;
            xml+=XML.startTag+XML.slash+this.tagName+XML.endTag;
            return xml;
        }
    }
});    
var XMLEntity=function(){};
Object.defineProperties(XMLEntity.prototype,
{
    toXML:
    {
        value:function()
        {
            var xml ='';
            if(!this.tagName)
            {
                return xml; 
            }
            if(this.root)
            {
                xml+=XML.meta;
            }
            xml+= XML.startTag+this.tagName+XML.whitespace;
            if(this.attributes)
            {
                var attributesStr='';
                var keys = Object.keys(this.attributes);
                for(var i=0;i<keys.length;i++)
                {
                    var key = keys[i];
                    attributesStr+=key+XML.equalSign+XML.single_quote+this.attributes[key]+XML.single_quote+XML.whitespace;
                }
                xml+=attributesStr;
            }

            xml+=XML.endTag;
            if(this.children)
            {
                var contentStr='';
                var childrenKeys = Object.keys(this.children);
                for(var k=0;k<childrenKeys.length;k++)
                {
                    var childKey = childrenKeys[k];
                    var child = this.children[childKey];
                    contentStr+=child.toXML();
                }
                xml+=contentStr;
            }
            xml+=XML.startTag+XML.slash+this.tagName+XML.endTag;
            return xml;
        }
    }
 });

var Workbook=function()
{
    this.children={};
    this.children.sheets=new Sheets();
};
Workbook.extends(XMLEntity);
Object.defineProperties(Workbook.prototype,
{
   tagName:{value:'workbook'},
   root:{value:true}, 
   addSheet:
   {
       value:function(sheet)
       {
           this.children.sheets.addSheet(sheet);
       }
   }
});
var Sheets=function()
{
    this.children={};
};
Sheets.extends(XMLEntity);
Object.defineProperties(Sheets.prototype,
{
   tagName:{value:'sheets'},
   addSheet:
   {
       value:function(sheet)
       {
           //todo(anton) refactor it. Why do we need object at all?
           this.children[sheet.id]=sheet;
       }
   }
});

var Sheet=function(id,name)
{
    this.attributes={};
    this.attributes.id=id;
    this.attributes.name=name;
};
Sheet.extends(XMLEntity);
Object.defineProperties(Sheet.prototype,
{
   tagName:{value:'sheet'}
});

var Worksheet = function()
{
    this.children={};
    this.children.sheetData = new SheetData();
};
Worksheet.extends(XMLEntity);

Object.defineProperties(Worksheet.prototype,
{
   root:{value:true}, 
   tagName:{value:'worksheet'},
   addRow:
   {
       value:function(id)
       {
           this.children.sheetData.addRow(id);
       }
   },
    addCell:
    {
        value:function(rowNum,colNum,value)
        {
            this.children.sheetData.addCell(rowNum,colNum,value);
        }
    }

});

var SheetData=function()
{
    this.children={};
};
SheetData.extends(XMLEntity);
Object.defineProperties(SheetData.prototype,
{
   tagName:{value:'sheetData'},
   addRow:
   {
       value:function(id)
       {
           var row=new Row(id);
           this.children[id]=row;
           return row;
       }
   },
   addCell:
   {
       value:function(rowNum,colNum,value)
       {
           var row = this.children[rowNum];
           if(!row)
           {
               row = this.addRow(rowNum);
           }
           row.addCell(colNum,value);
       }
   }
});

var Row = function(id)
{
   this.attributes={};
   this.attributes.r=id;
   this.children=[];
};
Row.extends(XMLEntity);
Object.defineProperties(Row.prototype,
{
   tagName:{value:'row'},
   addCell:
   {
       value:function(colNum,value)
       {
           this.children.colNum=new Cell(colNum,value);
       }
   }
});

var Cell = function(columnId,value)
{
    this.attributes={};
    this.attributes.r=columnId;
    this.children={};
    this.children.value=new CellValue(value);
};
Cell.extends(XMLEntity);
Object.defineProperties(Cell.prototype,
{
   tagName:{value:'c'}
});

var CellValue=function(value)
{
    this.value=value;
}
CellValue.extends(ValueEntity);
Object.defineProperties(CellValue.prototype,
{
   tagName:{value:'v'}
});
