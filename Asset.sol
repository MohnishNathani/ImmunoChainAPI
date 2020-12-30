pragma solidity 0.5.1;

contract Asset{
    uint256 public med_count=0;
    mapping(uint => med) public Package;
    
    event Update (uint id, string temp, string pressure);
    event add(uint id,string date);
    
    struct med{
        uint id;
        string date;
        string manufacturer;
        string temp;
        string pressure;
        string batch;
        string quality;
        string state;
    }
    
    function addMed (string memory _date, 
                     string memory _manufacturer, 
                     string memory _temp, 
                     string memory _pressure, 
                     string memory _batch, 
                     string memory _quality, 
                     string memory _state) public{
                         
                    med_count +=1;
                    Package[med_count] = med(med_count,_date,_manufacturer,_temp,_pressure,_batch,_quality,_state);
                    
                    emit add(med_count,_date);
    }
    
    function updateMed(uint  _id,
                       string memory _changetemp,
                       string memory _changepressure,
                       string memory _state) public {
        
                        Package[_id].temp = _changetemp;
                        Package[_id].pressure = _changepressure;
                        Package[_id].state = _state;
                        
                        emit Update(_id,_changetemp,_changepressure);
    }
    
    function returnMed() public view returns(string memory, string memory){
        return (Package[1].manufacturer ,Package[1].date);
    }
}

