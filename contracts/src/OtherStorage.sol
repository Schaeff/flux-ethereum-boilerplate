contract OtherStorage {
    uint storedData;
    event newData(uint newData);
    function set(uint x) {
        storedData = x;
        newData(x);
    }
    function get() constant returns (uint retVal) {
        return storedData;
    }
}