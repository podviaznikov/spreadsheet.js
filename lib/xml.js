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
