/*
    - Launched when a node is started to make sure that only one adapter is executing commands
    - Launched also to make active a redundant node

 */
var fileTransferTest = {
    startFileTransfer:function () {
        console.log("Starting fileTransferTest");
        this.swarm("node1Phase");
    },
    node1Phase:{
        node:"Node1",
        code:function () {
            var filename = swarmTempFile.async();
            var self = this;
            (function(filename){
                self.fileName =  filename;
                self.fileContent = "Test content";
                require("fs").writeFileSync(filename, self.fileContent);
                thisAdapter.fileBus.transferFile(self.fileName, "FB_Node2",self, "node2Confirm");
            }).swait(filename);
        }
    },
    node2Confirm:{
        node:"Node2",
        do:function () {
            //waked up when transfer was done
            console.log("File: ", this.fileName, " from node1 is now copied in node2 in ", this.__payload);
            if(require("fs").readFileSync(this.__payload) == this.fileContent){
                this.result = "Passed";
            } else {
                this.result = "Failed";
            }
            console.log("Result:", this.result, M(this));
            this.home("result");
        }
    }
}

fileTransferTest;