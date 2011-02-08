"use strict";
var FileIo = Object.create({},
{
    createFile:
    {
        value:function(fs,fileName,success,error)
        {
            console.log('Opened file system: ' + fs.name);
            fs.root.getFile(fileName, {create: true},success,error);
        }
    },

    createFileAndWrite:
    {
        value:function(fs,fileName,blob,error,success)
        {
            this.createFile(fs,fileName,function(fileEntry)
            {
                // Create a FileWriter object for FileEntry (filename).
                fileEntry.createWriter(function(fileWriter)
                {
                   fileWriter.onwriteend = function(e)
                   {
                       console.log('Write completed.');
                       success();
                   };

                   fileWriter.onerror = function(e)
                   {
                       console.log('Write failed: ' + e.toString());
                   };

                   // write blob to the fileName
                   fileWriter.write(blob);

                }, error);
           }, error);
        }
    },

    dataStringToBlob:
    {
        value:function(dataString,type)
        {
            dataString=dataString.replace(/^data:image\/(png|jpg);base64,/, '')
            var decodedString = atob(dataString);
            var dataLength = decodedString.length;
            var arrayData = new Int8Array(dataLength);
            for(var i = 0; i < dataLength; i++)
            {
                arrayData[i] = decodedString.charCodeAt(i)
            }
            var blobBuilder = new BlobBuilder(type);
            blobBuilder.append(arrayData.buffer);
            return blobBuilder.getBlob(type);
        }
    },
    encodedDataToBlob:
    {
        value:function(data,type)
        {
            var decodedString = atob(data);
            var dataLength = decodedString.length;
            var arrayData = new Int8Array(dataLength);
            for(var i = 0; i < dataLength; i++)
            {
                arrayData[i] = decodedString.charCodeAt(i)
            }
            var blobBuilder = new BlobBuilder(type);
            blobBuilder.append(arrayData.buffer);
            return blobBuilder.getBlob(type);
        }
    },
    writeFile:
    {
        value:function(fileName,fileType,dataString,success)
        {
            var self = this;
            window.requestFileSystem(window.PERSISTENT, 5*1020*1024*1024 /*5GB*/, function(fs)
            {
                var blob  = self.dataStringToBlob(dataString,fileType);
                self.createFileAndWrite(fs,fileName,blob,self.logError,success);
            }, self.logError);
        }
    },

    readFile:
    {
        value:function(file,success)
        {
            var reader = new FileReader();
            reader.onload = function(e)
            {
                success(e.target.result,file);
            };
            
            // Read in the file as a data URL.
            reader.readAsDataURL(file);
        }
    },
    readFileAsBlob:
    {
        value:function(fileName,success)
        {
            var self = this;
            window.requestFileSystem(window.PERSISTENT, 5*1020*1024*1024 /*5GB*/, function(fs)
            {
                var blob  = self.dataStringToBlob(dataString,fileType);
                self.createFileAndWrite(fs,fileName,blob,self.logError,success);
            }, self.logError);

        }
        
    },
    logError:
    {
        value: function(e)
        {
            var msg = '';

            switch (e.code)
            {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
            case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
            default:
              msg = 'Unknown Error';
              break;
            };

            console.log('Error: ' + msg);
        }
    }
});
Object.defineProperty(File.prototype,
'shortName',
{
    value:function()
    {
        var dotIndex = this.name.lastIndexOf('.');
        return this.name.substring(0,dotIndex);
    }
});
Object.defineProperty(File.prototype,
'extension',
{
    value:function()
    {
        var dotIndex = this.name.lastIndexOf('.');
        return this.name.substring(dotIndex);
    }
});