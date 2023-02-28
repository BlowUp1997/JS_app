const $startScreen = document.getElementById("start-screen");
const $gameMenu = document.getElementById("game-menu");
const $battleMenu = document.getElementById("battle-menu");

const $startButton = document.getElementById("start");

const $heroState = document.getElementById("hero-stat");
const $heroName = document.getElementById("hero-name");
const $heroLevel = document.getElementById("hero-level");
const $heroHP = document.getElementById("hero-hp");
const $heroXP = document.getElementById("hero-xp");
const $heroAtt = document.getElementById("hero-att");

const $monsterName = document.getElementById("monster-name");
const $monsterHP = document.getElementById("monster-hp");
const $monsterAtt = document.getElementById("monster-att");

const $message = document.getElementById("message");

let game = null;

$startScreen.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target['name-input'].value;
    game = new Game(name);
});

class Game {
    constructor(name) {
        this.hero = null;

        this.monster = null;
        this.monsterList = [
            {name: '슬라임', hp: 25, att: 10, xp: 10},
            {name: '고블린', hp: 50, att: 20, xp: 20},
            {name: '흡혈귀', hp: 100, att: 35, xp: 40},
            {name: '마왕', hp: 250, att: 100, xp: 100},
        ];

        $gameMenu.addEventListener('submit', this.gameMenuInput);
        this.hero = new Hero(this, name);
        this.updateHeroStat();
        $battleMenu.addEventListener('submit', this.battleMenuInput);
        this.changeScreen('game');
    }

    gameMenuInput = (e) => {
        e.preventDefault();
        const input = e.target['menu-input'].value;

        switch (input) {
            case "1":
                this.changeScreen('battle');
                const randomMonster = this.monsterList[Math.floor(Math.random() * this.monsterList.length)];
                this.monster = new Monster(
                    randomMonster.name,
                    randomMonster.hp,
                    randomMonster.att,
                    randomMonster.xp,
                );
                this.updateMonsterStat();
                this.showMessage(`몬스터 ${this.monster.name}와 마주쳤다`);
                break;
            case "2":
                this.hero.hp += 20;
                if(this.hero.hp > this.hero.maxHp){
                    this.hero.hp = this.hero.maxHp;
                }
                this.updateHeroStat();
                this.showMessage('휴식을 취했다');
                break;

            case "3":
                this.quit();
                break;
        }
    }

    battleMenuInput = (e) => {
        e.preventDefault();
        const input = e.target['battle-input'].value;
        switch (input) {
            case "1":
                this.hero.attack(this.monster);
                this.monster.attack(this.hero);
                if (this.hero.hp <= 0) {
                    this.showMessage(`${this.hero.lev} 레벨에서 전사했습니다. 다시 도전하세요`);
                    this.quit();
                } else if (this.monster.hp <= 0) {
                    this.showMessage(`${this.monster.xp} 경험치를 얻었다.`);
                    this.hero.getXp(this.monster.xp);
                    this.monster = null;
                    this.changeScreen('game');
                } else {
                    this.showMessage(`몬스터 -${this.hero.att}, ${this.hero.name} -${this.monster.att}`);
                }
                this.updateHeroStat();
                this.updateMonsterStat();
                break;

            case "2":
                this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + 20);
                this.monster.attack(this.hero);
                this.showMessage('휴식을 취해 체력을 회복했다');
                this.updateHeroStat();
                break;

            case "3":
                this.changeScreen('game');
                this.monster = null;
                this.showMessage('도망치는데 성공했다');
                this.updateMonsterStat();
                break;
        }
    }


    changeScreen(screen) {
        if (screen === 'start') {
            $startScreen.style.display = 'block';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'none';
        } else if (screen === 'game') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'block';
            $battleMenu.style.display = 'none';
        } else if (screen === 'battle') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'block';
        }
    }

    updateHeroStat() {
        if (this.hero === null) {
            $heroName.textContent = '';
            $heroLevel.textContent = '';
            $heroHP.textContent = '';
            $heroXP.textContent = '';
            $heroAtt.textContent = '';
            return;
        }
        $heroName.textContent = this.hero.name;
        $heroLevel.textContent = `level.${this.hero.lev}`;
        $heroHP.textContent = `HP: ${this.hero.hp}/${this.hero.maxHp}`;
        $heroXP.textContent = `XP: ${this.hero.xp}/${15 * this.hero.lev}`;
        $heroAtt.textContent = `ATT: ${this.hero.att}`;
    }
    updateMonsterStat() {
        if (this.monster === null) {
            $monsterName.textContent = '';
            $monsterHP.textContent = '';
            $monsterAtt.textContent = '';
            return;
        }
        $monsterName.textContent = this.monster.name;
        $monsterHP.textContent = `HP: ${this.monster.hp}/${this.monster.maxHp}`;
        $monsterAtt.textContent = `ATT: ${this.monster.att}`;
    }
    showMessage(text) {
        $message.textContent = text;
    }
    quit() {
        this.hero = null;
        this.monster = null;
        this.updateHeroStat();
        this.updateMonsterStat();
        $gameMenu.removeEventListener('submit', this.gameMenuInput);
        $battleMenu.removeEventListener('submit', this.battleMenuInput);
        this.changeScreen('start');
        game = null;
    }
}

//hero와 monster가 겹치는 스탯이 있기 때문에 하나의 class로 만들어서
class Unit {
    constructor(game, name, hp, att, xp) {
        this.game = game;
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.xp = xp;
        this.att = att;
    }
    attack(target) {
        target.hp -= this.att;
    }
}
class Hero extends Unit {
    constructor(game, name) {
        super(game, name, 100, 10, 0); //super은 부모 클래스 요소를 쓸 때 사용
        this.lev = 1;
    }

    attack(target) {
        super.attack(target);
    }

    getXp(xp) {
        this.xp += xp;
        //레벨업 조건
        if (this.xp >= this.lev * 15) {
            this.xp -= this.lev * 15;
            this.lev += 1;
            this.maxHp += 10;
            this.att += 10;
            this.hp = this.maxHp;
            this.game.showMessage(`레벨업! -level. ${this.lev}`);
        }
    }
}

class Monster extends Unit {
    constructor(game, name, hp, att, xp) {
        super(game, name, hp, att, xp);
    }
}
