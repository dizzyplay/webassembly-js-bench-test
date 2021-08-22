import * as snow from 'snow';

(() => {
	t(1,1);	
})();

function t(flag, flag2) {
	if (flag) {
		rustSnow(2000,2000,30000);
	}
	if (flag2) {
		jsSnow(2000,2000,30000);
	}
}

function performanceChecker(fn, el) {
	const t1 = performance.now();
	fn();
	const t2 = performance.now();
	const interval = t2 - t1;
	el.style.width = interval * 100  + 'px';
}

function rustSnow(W,H,count) {
	const pfDom2 = document.getElementById('performance2');
	const canvas1 = document.getElementById('canvas2');
	const ctx = canvas1.getContext('2d');

	const s = snow.SnowCanvas.new(W,H,count);
	function draw() {
		ctx.clearRect(0, 0, W, H);

		ctx.fillStyle = 'black';
		ctx.rect(10, 10, W, H);
		ctx.fill();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.beginPath();
		ctx.fill();
		for (let i = 0; i < count; i++) {
			const x = s.get_particle_x(i);
			const y = s.get_particle_y(i);
			const r = s.get_particle_r(i);

			ctx.moveTo(x, y);
			ctx.arc(x, y, r, 0, Math.PI * 2, true);
		}
		ctx.fill();
		const update = s.update;
		performanceChecker(update.bind(s), pfDom2);
		requestAnimationFrame(draw);
	}

	canvas1.width = W;
	canvas1.height = H;

	draw();
}
function jsSnow(W,H,count) {
	const pfDom = document.getElementById('performance1');
	const canvas1 = document.getElementById('canvas2');
	const ctx = canvas1.getContext('2d');

	function update() {
		angle += 0.01;
		for (let i = 0; i < count; i++) {
			const p = particles[i];
			p.y += Math.cos(angle + p.d) - 0.5 + p.r / 1.5;
			p.x += Math.sin(angle) * 1.5;

			if (p.x > W + 5 || p.x < -5 || p.y > H) {
				if (i % 3 > 0) {
					particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
				} else {
					// eslint-disable-next-line no-lonely-if
					if (Math.sin(angle) > 0) {
						particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d };
					} else {
						particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d };
					}
				}
			}
		}
	}

	const particles = [];
	for (let i = 0; i < count; i++) {
		particles.push({
			x: Math.random() * W,
			y: Math.random() * H,
			r: Math.random(),
			d: Math.random() * count,
		});
	}

	let angle = 0;

	function draw() {
		ctx.clearRect(0, 0, W, H);

		ctx.fillStyle = 'black';
		ctx.rect(10, 10, W, H);
		ctx.fill();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.beginPath();
		ctx.fill();
		for (let i = 0; i < count; i++) {
			const p = particles[i];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
		}
		ctx.fill();
		performanceChecker(update, pfDom);
		requestAnimationFrame(draw);
	}

	canvas1.width = W;
	canvas1.height = H;

	draw();
}
