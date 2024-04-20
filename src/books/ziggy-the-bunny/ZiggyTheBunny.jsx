import Book from '../Book';

export default class ZiggyTheBunny extends Book {
    get bookKey() {
        return 'ziggy-the-bunny';
    }

    get images() {
        return [
            '/books/ziggy-the-bunny/0-cover.webp',
            '/books/ziggy-the-bunny/1.webp',
            '/books/ziggy-the-bunny/2.webp',
            '/books/ziggy-the-bunny/3.webp',
            '/books/ziggy-the-bunny/4.webp',
            '/books/ziggy-the-bunny/5.webp',
            '/books/ziggy-the-bunny/6.webp',
        ];
    }

    get texts() {
        return [
            'Ziggy the Bunny',
            `Princess Bowie, wearing her sparkly space suit, waves goodbye to her friends and family. With a grand countdown, her candy-colored rocket blasts off from the magical fairy castle, leaving a trail of shimmering stardust.`,
            `Landing softly on a fluffy, marshmallow-like surface, Princess Bowie is greeted by the curious alien bunnies. Their world is filled with giant carrot trees and lakes of blueberry juice. The bunnies hop around in zero gravity, and everything is bathed in a soft, rosy glow.`,
            `To welcome Princess Bowie, the bunnies organize a Friendship Festival. There's a cosmic dance under the stars, where the music is played on instruments that sound like tinkling bells and whistling comets. Bowie and the bunnies share stories, games, and laughter, learning about each other’s worlds.`,
            `Among the bunnies, Bowie befriends Ziggy, a small bunny with dreams bigger than her planet. Ziggy has always wished to see the fairy castle Bowie described, filled with magic and wonders. Moved by Ziggy’s wish, Bowie invites her to come back to the castle.`,
            `With Ziggy nestled safely in the rocket, they soar through a tapestry of twinkling stars and swirling galaxies, sharing stories of bravery and kindness. As they approach Bowie’s planet, the fairy castle shimmers in the distance, welcoming them home.`,
            `Princess Bowie and Ziggy, the alien bunny, become inseparable friends, exploring the magic of the fairy castle together. Their friendship stands as a beautiful reminder that kindness and curiosity can bridge worlds.`,
        ];
    }
}