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
var excelJs={};
var Workbook=function(){};
Object.defineProperties(Workbook.prototype,
{
   tagName:{value:'workbook'},
   sheets:{value:[]},
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
    this.id=id;
    this.name=name;
};
Object.defineProperties(Sheet.prototype,
{
   id:{value:1,writable:true},
   name:{value:'Sheet1',writable:true}, 
   tagName:{value:'sheet'},
   toXML:
   {
       value:function()
       {
           //<sheet name="Sheet3" sheetId="3" r:id="rId3"/>
           //what is r:id?
           return '<'+this.tagName+' '+'name="'+this.name+'" sheetId="'+this.id+'"/>';
       }
   }
});

