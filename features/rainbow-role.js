module.exports = (instance, client) => {
  const config = {
    guildId: '1151845690650140702', 
    roleId: '1151845690650140709', 
    colors: 24, 
    interval: 1000 * 70
  };

  function getHex(i, phase) {
    const sin = Math.sin(Math.PI / config.colors * 2 * i + phase);
    const int = Math.floor(sin * 127) + 128;
    
    return int.toString(16).padStart(2, '0') 
  };

  function getColors() {
    const Colors = []
    for (let i = 0; i < config.colors; i++) {
      const R = getHex(i, 0 * Math.PI * 2 / 3);
      const G = getHex(i, 1 * Math.PI * 2 / 3);
      const B = getHex(i, 2 * Math.PI * 2 / 3); 

      Colors.push('#' + R + G + B )
    }; 
    return Colors
  };

  function main() {
    let index = 0
    const hexList = getColors()
    const guild = client.guilds.cache.get(config.guildId);
    const role = guild.roles.cache.find(r => r.id === config.roleId);  
    
    function setColor() {
      const color = hexList[index % hexList.length] 
      role.setColor(color).catch(console.error)
      //console.log(`changed color to “${color}“ in “${guild.name}“`)
      index++
    };
    
    setInterval(setColor, config.interval) 
  };
  
  main()
};