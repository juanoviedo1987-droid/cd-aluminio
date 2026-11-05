const url = 'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=480036493';

fetch(url)
  .then(r => r.text())
  .then(csv => {
    console.log('CSV downloaded, length:', csv.length);
    const lines = csv.split('\n');
    console.log('Header line:', lines[0]);
    console.log('Sample row 1:', lines[1]);
    console.log('Sample row 2:', lines[2]);
  });
