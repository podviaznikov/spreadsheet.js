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
    'extend',
    {
        value: function extend(obj)
        {
            this.prototype.__proto__ = obj.prototype;
        }
    }
);
var excelJs={};
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
var XMLEntity=function(){};
Object.defineProperties(XMLEntity.prototype,
{
    tagName:{},
    toXML:
    {
        value:function()
        {
            var attributesStr='';
            var keys = Object.keys(this.attributes);
            for(var i=0;i<keys.length;i++)
            {
                var key = keys[i];
                attributesStr+=key+XML.equalSign+XML.single_quote+this.attributes[key]+XML.single_quote+XML.whitespace;
            }
            var xml ='';
            if(this.root)
            {
                xml+=XML.meta;
            }
            xml+= XML.startTag+this.tagName+XML.whitespace;
            xml+=attributesStr;
            xml+=XML.endTag;
            xml+=XML.startTag+XML.slash+this.tagName+XML.endTag;
            return xml;
        }
    }
 });

var Workbook=function(){};
Workbook.extend(XMLEntity);
Object.defineProperties(Workbook.prototype,
{
   tagName:{value:'workbook'},
   sheets:{value:[]},
   root:{value:true}, 
   addSheet:
   {
       value:function(sheet)
       {
           this.sheets.push(sheet);
       }
   },
   toXML:
   {
       value:function()
       {
           //<sheet name="Sheet3" sheetId="3" r:id="rId3"/>
           //what is r:id?
           var xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
           xml+='<'+this.tagName+'>';
           var sheetsXML='<sheets>';
           for(var i=0;i<this.sheets.length;i++)
           {
               var sheet=this.sheets[i];
               var sheetXML=sheet.toXML();
               sheetsXML+=sheetXML;
           }
           sheetsXML+='</sheets>';
           xml+=sheetsXML;
           xml+='</'+this.tagName+'>';
           return xml;
       }
   }
});

var Sheet=function(id,name)
{
    this.id=id||1;
    this.name=name||'Sheet1';
    this.attributes={};
    this.attributes.id=this.id;
    this.attributes.name=this.name;
};
Sheet.extend(XMLEntity);
Object.defineProperties(Sheet.prototype,
{
   id:{},
   name:{}, 
   tagName:{value:'sheet'}
});

var Worksheet = function()
{

};

Worksheet.extend(XMLEntity);

Object.defineProperties(Worksheet.prototype,
{
   tagName:{value:'worksheet'}
});
