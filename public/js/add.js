const farmForm = document.getElementById('farm-form');
const farmId = document.getElementById('farmid');
const farmAddress = document.getElementById('farmaddress');

// Send POST to API to add farm
async function addFarm(e) {
  e.preventDefault();

  if (farmId.value === '' || farmAddress.value === '') {
    alert('Please fill in fields');
  }

  const sendBody = {
    farmId: farmId.value,
    address: farmAddress.value
  };

  try {
    const res = await fetch('/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendBody)
    });

    if (res.status === 400) {
      throw Error('Farm already exists!');
    }

    alert('Farm added!');
    window.location.href = '/feed';
  } catch (err) {
    alert(err);
    return;
  }
}

farmForm.addEventListener('submit', addFarm);