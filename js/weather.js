// 天气效果脚本
class WeatherEffect {
  // 下雪就换成snow
  constructor(type = 'rain', options = {}) {
    this.type = type;
    this.options = {
      intensity: 100, // 雨滴/雪花数量
      speed: 5, // 下落速度
      angle: 2, // 倾斜角度
      color: '#ffffff', // 颜色
      size: 5, // 大小
      opacity: 0.8, // 透明度
      ...options
    };
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.isRunning = false;
  }

  init() {
    // 创建 canvas 元素
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'weather-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createParticles();

    // 监听窗口大小变化
    window.addEventListener('resize', () => this.resize());

    this.isRunning = true;
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.options.intensity; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: Math.sin(this.options.angle) * this.options.speed * 0.5,
      vy: Math.cos(this.options.angle) * this.options.speed,
      size: this.type === 'rain' ? this.options.size * 0.5 : this.options.size * (Math.random() * 0.5 + 0.5),
      opacity: this.options.opacity * (Math.random() * 0.5 + 0.5),
      life: Math.random() * 100 + 100
    };
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      // 粒子超出边界或生命周期结束，重新生成
      if (p.y > this.canvas.height || p.x > this.canvas.width || p.x < 0 || p.life <= 0) {
        this.particles[i] = this.createParticle();
        this.particles[i].y = -10;
      }
    }
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.options.color;

    for (const p of this.particles) {
      this.ctx.globalAlpha = p.opacity;
      
      if (this.type === 'rain') {
        // 绘制雨滴
        this.ctx.fillRect(p.x, p.y, p.size, p.size * 3);
      } else {
        // 绘制雪花
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
  }

  animate() {
    if (!this.isRunning) return;

    this.updateParticles();
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }

  stop() {
    this.isRunning = false;
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// 初始化天气效果
window.addEventListener('DOMContentLoaded', function() {
  // 这里可以切换 'rain' 或 'snow'
  const weather = new WeatherEffect('rain', {
    intensity: 150,
    speed: 6,
    angle: 0.1,
    size: 2,
    opacity: 0.7
  });
  weather.init();
});
