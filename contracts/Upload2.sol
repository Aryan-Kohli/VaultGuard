// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0;

contract Upload2 {
    // this is the structure of any type of file which will be uploaded
    // struct FileData{
    //     string  url;
    //     string name;
    //     string  timeStamp;
    //     string size;
    // }
    //this is the portion for storing previous transactions
    struct TransactionBlock {
        string desc;
        string timeStamp;
    }
    mapping(address => TransactionBlock[]) Transactions;
    // portion for displaying just files desciption excluding file access persons
    struct FileAccess {
        string url;
        string name;
        string timeStamp;
        string size;
        bool access; // agar file delete hogi ya remove to isko false krna hai.kyunki delete nhi kr skte blockchain mein
    }
    mapping(address => mapping(address => FileAccess[])) Ownership;
    //[shared_person][owner]=>[ {FileData,access} ]

    //portion for getting AcessList of each File
    struct sharedAccess {
        address sharedPerson;
        bool access;
    }
    mapping(address => mapping(string => sharedAccess[])) FileAccessList;
    // [owner][file_url][ {sharedPerson Address , bool access},{},{}]

    function getTransactions()
        external
        view
        returns (TransactionBlock[] memory)
    {
        return Transactions[msg.sender];
    }

    function AddFile(
        string memory _url,
        string memory _name,
        string memory _timeStamp,
        string memory _size,
        string memory TransactionString
    ) external {
        FileAccess memory newFileAccess = FileAccess(
            _url,
            _name,
            _timeStamp,
            _size,
            true
        );
        FileAccess[] storage userFiles = Ownership[msg.sender][msg.sender];
        userFiles.push(newFileAccess);

        Transactions[msg.sender].push(
            TransactionBlock(TransactionString, _timeStamp)
        );
    }

    function getMyFiles() external view returns (FileAccess[] memory) {
        return Ownership[msg.sender][msg.sender];
    }

    function sharedFiles(
        address _owner
    ) external view returns (FileAccess[] memory) {
        return Ownership[msg.sender][_owner];
    }

    function giveAccess(
        string memory _url,
        string memory _name,
        string memory _timeStamp,
        string memory _size,
        address _sharedPerson,
        string memory TransactionString
    ) external {
        FileAccess memory newFileAccess = FileAccess(
            _url,
            _name,
            _timeStamp,
            _size,
            true
        );
        FileAccess[] storage userFiles = Ownership[_sharedPerson][msg.sender];
        userFiles.push(newFileAccess);
        FileAccessList[msg.sender][_url].push(
            sharedAccess(_sharedPerson, true)
        );

        Transactions[msg.sender].push(
            TransactionBlock(TransactionString, _timeStamp)
        );
    }

    function getAccesList(
        string memory _url
    ) external view returns (sharedAccess[] memory) {
        return FileAccessList[msg.sender][_url];
    }

    function removeAccess(
        string memory _url,
        address _sharedPerson,
        string memory TransactionString,
        string memory _timeStamp
    ) public {
        uint n = Ownership[msg.sender][_sharedPerson].length;
        for (uint i = 0; i < n; i++) {
            if (
                keccak256(bytes(Ownership[msg.sender][_sharedPerson][i].url)) ==
                keccak256(bytes(_url))
            ) {
                Ownership[msg.sender][_sharedPerson][i].access = false;
            }
        }
        uint n2 = FileAccessList[msg.sender][_url].length;
        for (uint i = 0; i < n2; i++) {
            if (
                FileAccessList[msg.sender][_url][i].sharedPerson ==
                _sharedPerson
            ) {
                FileAccessList[msg.sender][_url][i].access = false;
            }
        }

        Transactions[msg.sender].push(
            TransactionBlock(TransactionString, _timeStamp)
        );
    }
}
