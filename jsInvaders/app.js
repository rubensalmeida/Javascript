//All credits to Ania Kubow
//https://github.com/kubowania
//https://www.youtube.com/watch?v=kSt2_YZzCec

document.addEventListener('DOMContentLoaded', () => {

	const grid = document.querySelector('.grid');
	const dimensions = 15 * 15;

	for (let i = 0; i < dimensions; i++) {
		let newDiv = document.createElement("div");
		grid.appendChild(newDiv);
	};

	const squares = document.querySelectorAll('.grid div');
	const results = document.querySelector('#result');
	let width = 15;
	let currShooterIndex = 202;
	let currInvaderIndex = 0;
	let invadersTakenDown = [];
	let result = 0;
	let direction = 1;
	let invaderId;

	//set initial position of the invaders in the grid
	const invadersPosition = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		30, 31, 32, 33, 34, 35, 36, 37, 38, 39
	];

	//draw all the invaders in the grid
	invadersPosition.forEach(invader => squares[currInvaderIndex + invader].classList.add('invader'));

	//draw the player shooter in the grid
	squares[currShooterIndex].classList.add('shooter');

	//define shooter movement
	function moveShooter(e) {

		squares[currShooterIndex].classList.remove('shooter');

		switch (e.keyCode) {
			case 37:
				if (currShooterIndex % width !== 0) {
					currShooterIndex -= 1;
				}
				break;
			case 39:
				if (currShooterIndex % width < width - 1) {
					currShooterIndex += 1;
				}
				break;

		}
		squares[currShooterIndex].classList.add('shooter');
	}
	document.addEventListener('keydown', moveShooter);

	function moveInvaders(e) {

		const leftEdge = invadersPosition[0] % width === 0;
		const rightEdge = invadersPosition[invadersPosition.length - 1] % width === width - 1;

		if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
			direction = width;
		} else if (direction === width) {
			if (leftEdge) {
				direction = 1;
			} else {
				direction = -1;
			}
		}
		for (let i = 0; i <= invadersPosition.length - 1; i++) {
			squares[invadersPosition[i]].classList.remove('invader');
		}
		for (let i = 0; i <= invadersPosition.length - 1; i++) {
			invadersPosition[i] += direction;
		}
		for (let i = 0; i <= invadersPosition.length - 1; i++) {
			if (!invadersTakenDown.includes(i)) {
				squares[invadersPosition[i]].classList.add('invader');
			}
		}

		//check if game is over
		if (squares[currShooterIndex].classList.contains('invader', 'shooter')) {
			results.textContent = 'Game Over!';
			squares[currShooterIndex].classList.add('boom');
			clearInterval(invaderId);
		}

		for (let i = 0; i <= invadersPosition.length - 1; i++) {
			if (invadersPosition[i] > (squares.length - (width - 1))) {
				results.textContent = 'Game Over!';
				clearInterval(invaderId);
			}
		}

		//check if it's a win
		if (invadersTakenDown.length === invadersPosition.length) {
			results.textContent = 'Victory!';
			clearInterval(invaderId);
		}


	}//function moveInvaders
	invaderId = setInterval(moveInvaders, 500);

	//shoot the aliens
	function shoot(e) {
		let laserId;
		let currLaserIndex = currShooterIndex;

		function moveLaser() {

			squares[currLaserIndex].classList.remove('laser');
			currLaserIndex -= width;
			squares[currLaserIndex].classList.add('laser');

			if (squares[currLaserIndex].classList.contains('invader')) {

				squares[currLaserIndex].classList.remove('laser');
				squares[currLaserIndex].classList.remove('invader');
				squares[currLaserIndex].classList.add('boom');

				setTimeout(() => squares[currLaserIndex].classList.remove('boom'), 250);
				clearInterval(laserId);

				const invaderTakenDown = invadersPosition.indexOf(currLaserIndex);
				invadersTakenDown.push(invaderTakenDown);
				result++;
				results.textContent = result;

			}
			if (currLaserIndex < width) {
				clearInterval(laserId);
				setTimeout(() => squares[currLaserIndex].classList.remove('laser'), 100);
			}


		}//moveLaser

		// document.addEventListener('keyup', e => {
		// 	if (e.keyCode === 32) {
		// 		laserId = setInterval(moveLaser, 100);
		// 	}
		// });

		switch (e.keyCode) {
			case 32:
				laserId = setInterval(moveLaser, 100);
				break;
		}//switch

	}//shoot

	document.addEventListener('keyup', shoot);

});