const fs = require('fs')
const Deal = require('../models/deal');
const overzicht_path = 'overzicht.csv';

module.exports = async () => {
  const deals = await Deal.find({});
  console.log(deals);

  const headers = Object.keys(deals[0]).join(',');
  console.log(typeof(deals));
  console.log(deals.map(d => Object.values(d)));
  console.log(headers);
  const cs_deals = deals.map(d => Object.values(d).join(','));
  console.log(cs_deals);
  const res = `${headers}\n${cs_deals.join('\n')}`;
  console.log(res);
  await fs.writeFile(overzicht_path, res, (err) => {
    if(err) throw err;
    console.log('overzicht written');
  });
}

