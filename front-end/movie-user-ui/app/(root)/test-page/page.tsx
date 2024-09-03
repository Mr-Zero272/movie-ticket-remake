import { fetchListFavoriteMovies } from '@/services/favoriteServices';
import { fetchPopularMovies } from '@/services/movieServices';
import { fetchUser } from '@/services/userServices';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import FavoriteMain from './favorite-main';

type Props = {};

const TestPage = async (props: Props) => {
    const popularMovies = [
        {
            id: 144,
            title: 'Alien: Romulus',
            adult: false,
            budget: 80000000,
            originalLanguage: 'en',
            overview:
                'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
            status: 'Upcoming',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 7.3,
            voteCount: 387,
            runtime: 119,
            releaseDate: '2024-08-13',
            deleteFlag: false,
            genres: [
                {
                    id: 27,
                    name: 'Horror',
                },
                {
                    id: 878,
                    name: 'Science Fiction',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 56000,
            detailShowingTypes: [
                {
                    id: 573,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 574,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 575,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 576,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 144,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 142,
            title: 'It Ends with Us',
            adult: false,
            budget: 25000000,
            originalLanguage: 'en',
            overview:
                "Lily Bloom overcomes a traumatic childhood to embark on a new life in Boston and chase a lifelong dream of opening her own business. A chance meeting with charming neurosurgeon Ryle Kincaid sparks an intense connection, but as the two fall deeply in love, Lily begins to see sides of Ryle that remind her of her parents' relationship.",
            status: 'Upcoming',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//AjV6jFJ2YFIluYo4GQf13AA1tqu.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 7.1,
            voteCount: 116,
            runtime: 131,
            releaseDate: '2024-08-07',
            deleteFlag: false,
            genres: [
                {
                    id: 18,
                    name: 'Drama',
                },
                {
                    id: 10749,
                    name: 'Romance',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 106000,
            detailShowingTypes: [
                {
                    id: 565,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 566,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 567,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 568,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 142,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 71,
            title: 'The Instigators',
            adult: false,
            budget: 0,
            originalLanguage: 'en',
            overview:
                'Rory and Cobby are unlikely partners thrown together for a heist. But when it goes awry, they team up to outrun police, backward bureaucrats, and a vengeful crime boss.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//pIz9csYn1yjrzQi0BuBZNJrTMi0.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 6.529,
            voteCount: 138,
            runtime: 101,
            releaseDate: '2024-08-02',
            deleteFlag: false,
            genres: [
                {
                    id: 28,
                    name: 'Action',
                },
                {
                    id: 35,
                    name: 'Comedy',
                },
                {
                    id: 80,
                    name: 'Crime',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 103000,
            detailShowingTypes: [
                {
                    id: 281,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 282,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 283,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 284,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 71,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaulBackdop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 126,
            title: 'Saving Bikini Bottom: The Sandy Cheeks Movie',
            adult: false,
            budget: 100000000,
            originalLanguage: 'en',
            overview:
                'When Bikini Bottom is scooped from the ocean, scientific squirrel Sandy Cheeks and her pal SpongeBob SquarePants saddle up for Texas to save their town.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//30YnfZdMNIV7noWLdvmcJS0cbnQ.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 6.442,
            voteCount: 130,
            runtime: 87,
            releaseDate: '2024-08-01',
            deleteFlag: false,
            genres: [
                {
                    id: 12,
                    name: 'Adventure',
                },
                {
                    id: 16,
                    name: 'Animation',
                },
                {
                    id: 35,
                    name: 'Comedy',
                },
                {
                    id: 10751,
                    name: 'Family',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 124000,
            detailShowingTypes: [
                {
                    id: 501,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 502,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 503,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 504,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 126,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaulBackdop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 110,
            title: 'Trap',
            adult: false,
            budget: 30000000,
            originalLanguage: 'en',
            overview:
                "A father and teen daughter attend a pop concert, where they realize they're at the center of a dark and sinister event.",
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//mWV2fNBkSTW67dIotVTXDYZhNBj.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 6.359,
            voteCount: 252,
            runtime: 105,
            releaseDate: '2024-07-31',
            deleteFlag: false,
            genres: [
                {
                    id: 53,
                    name: 'Thriller',
                },
                {
                    id: 80,
                    name: 'Crime',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 157000,
            detailShowingTypes: [
                {
                    id: 437,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 438,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 439,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 440,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 110,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaulBackdop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 150,
            title: 'Trap',
            adult: false,
            budget: 30000000,
            originalLanguage: 'en',
            overview:
                "A father and teen daughter attend a pop concert, where they realize they're at the center of a dark and sinister event.",
            status: 'Upcoming',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//mWV2fNBkSTW67dIotVTXDYZhNBj.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 6.344,
            voteCount: 356,
            runtime: 105,
            releaseDate: '2024-07-31',
            deleteFlag: false,
            genres: [
                {
                    id: 53,
                    name: 'Thriller',
                },
                {
                    id: 80,
                    name: 'Crime',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 171000,
            detailShowingTypes: [
                {
                    id: 597,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 598,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 599,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 600,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 150,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 121,
            title: 'Deadpool & Wolverine',
            adult: false,
            budget: 200000000,
            originalLanguage: 'en',
            overview:
                'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//hBQOWY8qWXJVFAc8yLTh1teIu43.jpg',
            voteAverage: 7.839,
            voteCount: 1833,
            runtime: 128,
            releaseDate: '2024-07-24',
            deleteFlag: false,
            genres: [
                {
                    id: 28,
                    name: 'Action',
                },
                {
                    id: 35,
                    name: 'Comedy',
                },
                {
                    id: 878,
                    name: 'Science Fiction',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 117000,
            detailShowingTypes: [
                {
                    id: 481,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 482,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 483,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 484,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 121,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//hBQOWY8qWXJVFAc8yLTh1teIu43.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 104,
            title: 'My Spy The Eternal City',
            adult: false,
            budget: 0,
            originalLanguage: 'en',
            overview:
                'JJ, a veteran CIA agent, reunites with his protégé Sophie, in order to prevent a catastrophic nuclear plot targeting the Vatican.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//Bf3vCfM94bSJ1saZlyi0UW0e0U.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//angv94i35QiS5bq8J02hrLSDF5q.jpg',
            voteAverage: 6.725,
            voteCount: 227,
            runtime: 112,
            releaseDate: '2024-07-18',
            deleteFlag: false,
            genres: [
                {
                    id: 28,
                    name: 'Action',
                },
                {
                    id: 35,
                    name: 'Comedy',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 79000,
            detailShowingTypes: [
                {
                    id: 413,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 414,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 415,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 416,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 104,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//angv94i35QiS5bq8J02hrLSDF5q.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 102,
            title: 'Justice League: Crisis on Infinite Earths Part Three',
            adult: false,
            budget: 0,
            originalLanguage: 'en',
            overview:
                'Now fully revealed as the ultimate threat to existence, the Anti-Monitor wages an unrelenting attack on the surviving Earths that struggle for survival in a pocket universe. One by one, these worlds and all their inhabitants are vaporized! On the planets that remain, even time itself is shattered, and heroes from the past join the Justice League and their rag-tag allies against the epitome of evil. But as they make their last stand, will the sacrifice of the superheroes be enough to save us all?',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//a3q8NkM8uTh9E23VsbUOdDSbBeN.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//8STbpmPoVcBnZAQOAZYDhmLzoKG.jpg',
            voteAverage: 7.4,
            voteCount: 155,
            runtime: 99,
            releaseDate: '2024-07-16',
            deleteFlag: false,
            genres: [
                {
                    id: 16,
                    name: 'Animation',
                },
                {
                    id: 28,
                    name: 'Action',
                },
                {
                    id: 878,
                    name: 'Science Fiction',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 176000,
            detailShowingTypes: [
                {
                    id: 405,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 406,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 407,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 408,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 102,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//8STbpmPoVcBnZAQOAZYDhmLzoKG.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 132,
            title: 'Descendants: The Rise of Red',
            adult: false,
            budget: 0,
            originalLanguage: 'en',
            overview:
                "After the Queen of Hearts incites a coup on Auradon, her rebellious daughter Red and Cinderella's perfectionist daughter Chloe join forces and travel back in time to try to undo the traumatic event that set Red's mother down her villainous path.",
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//t9u9FWpKlZcp0Wz1qPeV5AIzDsk.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//bPLL28xj5MqCBYiaixG4yMYKkpe.jpg',
            voteAverage: 7.004,
            voteCount: 241,
            runtime: 92,
            releaseDate: '2024-07-11',
            deleteFlag: false,
            genres: [
                {
                    id: 12,
                    name: 'Adventure',
                },
                {
                    id: 14,
                    name: 'Fantasy',
                },
                {
                    id: 35,
                    name: 'Comedy',
                },
                {
                    id: 10751,
                    name: 'Family',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 106000,
            detailShowingTypes: [
                {
                    id: 525,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 526,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 527,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 528,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 132,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//bPLL28xj5MqCBYiaixG4yMYKkpe.jpg',
                },
            ],
            userFavoriteMovies: [
                {
                    id: 6,
                    userId: 'user_2jP9y7BWlKP6UTCmZsVYqd9fPgz',
                    dateAdded: '2024-09-02T21:32:31.440789',
                },
            ],
        },
        {
            id: 155,
            title: 'Longlegs',
            adult: false,
            budget: 10000000,
            originalLanguage: 'en',
            overview:
                'In pursuit of a serial killer, an FBI agent uncovers a series of occult clues that she must solve to end his terrifying killing spree.',
            status: 'Upcoming',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//5aj8vVGFwGVbQQs26ywhg4Zxk2L.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 6.726,
            voteCount: 265,
            runtime: 101,
            releaseDate: '2024-07-10',
            deleteFlag: false,
            genres: [
                {
                    id: 27,
                    name: 'Horror',
                },
                {
                    id: 53,
                    name: 'Thriller',
                },
                {
                    id: 80,
                    name: 'Crime',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 166000,
            detailShowingTypes: [
                {
                    id: 617,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 618,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 619,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 620,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 155,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 130,
            title: 'Twisters',
            adult: false,
            budget: 155000000,
            originalLanguage: 'en',
            overview:
                'As storm season intensifies, the paths of former storm chaser Kate Carter and reckless social-media superstar Tyler Owens collide when terrifying phenomena never seen before are unleashed. The pair and their competing teams find themselves squarely in the paths of multiple storm systems converging over central Oklahoma in the fight of their lives.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//pjnD08FlMAIXsfOLKQbvmO0f0MD.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//bnb3pWSDihCCeZ0wGlFBbTScyZv.jpg',
            voteAverage: 7.109,
            voteCount: 612,
            runtime: 123,
            releaseDate: '2024-07-10',
            deleteFlag: false,
            genres: [
                {
                    id: 12,
                    name: 'Adventure',
                },
                {
                    id: 18,
                    name: 'Drama',
                },
                {
                    id: 28,
                    name: 'Action',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 86000,
            detailShowingTypes: [
                {
                    id: 517,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 518,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 519,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 520,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 130,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//bnb3pWSDihCCeZ0wGlFBbTScyZv.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 103,
            title: 'MaXXXine',
            adult: false,
            budget: 1000000,
            originalLanguage: 'en',
            overview:
                'In 1980s Hollywood, adult film star and aspiring actress Maxine Minx finally gets her big break. But as a mysterious killer stalks the starlets of Hollywood, a trail of blood threatens to reveal her sinister past.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//ArvoFK6nlouZRxYmtIOUzKIrg90.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//HhDOcUwm8ghreO9s50YJWhBJqc.jpg',
            voteAverage: 6.303,
            voteCount: 295,
            runtime: 104,
            releaseDate: '2024-07-04',
            deleteFlag: false,
            genres: [
                {
                    id: 27,
                    name: 'Horror',
                },
                {
                    id: 80,
                    name: 'Crime',
                },
                {
                    id: 9648,
                    name: 'Mystery',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 188000,
            detailShowingTypes: [
                {
                    id: 409,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 410,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 411,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 412,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 103,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//HhDOcUwm8ghreO9s50YJWhBJqc.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 149,
            title: 'MaXXXine',
            adult: false,
            budget: 1000000,
            originalLanguage: 'en',
            overview:
                'In 1980s Hollywood, adult film star and aspiring actress Maxine Minx finally gets her big break. But as a mysterious killer stalks the starlets of Hollywood, a trail of blood threatens to reveal her sinister past.',
            status: 'Upcoming',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//ArvoFK6nlouZRxYmtIOUzKIrg90.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//HhDOcUwm8ghreO9s50YJWhBJqc.jpg',
            voteAverage: 6.377,
            voteCount: 351,
            runtime: 104,
            releaseDate: '2024-07-04',
            deleteFlag: false,
            genres: [
                {
                    id: 27,
                    name: 'Horror',
                },
                {
                    id: 53,
                    name: 'Thriller',
                },
                {
                    id: 80,
                    name: 'Crime',
                },
                {
                    id: 9648,
                    name: 'Mystery',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 145000,
            detailShowingTypes: [
                {
                    id: 593,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 594,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 595,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 596,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 149,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//HhDOcUwm8ghreO9s50YJWhBJqc.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 282,
            title: 'A Family Affair',
            adult: false,
            budget: 0,
            originalLanguage: 'en',
            overview:
                "The only thing worse than being the assistant to a high-maintenance movie star who doesn't take you seriously? Finding out he's smitten with your mom.",
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//l0CaVyqnTsWwNd4hWsrLNEk1Wjd.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 5.944,
            voteCount: 426,
            runtime: 114,
            releaseDate: '2024-06-27',
            deleteFlag: false,
            genres: [
                {
                    id: 35,
                    name: 'Comedy',
                },
                {
                    id: 10749,
                    name: 'Romance',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 78000,
            detailShowingTypes: [
                {
                    id: 1125,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 1126,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 1127,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 1128,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 290,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 230,
            title: 'Horizon: An American Saga - Chapter 1',
            adult: false,
            budget: 50000000,
            originalLanguage: 'en',
            overview:
                'Follow the story of how the Old West was won—and lost—through the blood, sweat and tears of many. Spanning 15 years before, during and following the Civil War from 1859 to 1874, embark on an emotional journey across a country at war with itself, experienced through the lens of families, friends and foes all attempting to discover what it truly means to be the United States of America.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//hqDkO0W9uk4aiwzn3pTeLO7NPZD.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//wwqHma9UrYCTzspanzKwlxKcOwt.jpg',
            voteAverage: 6.879,
            voteCount: 186,
            runtime: 182,
            releaseDate: '2024-06-26',
            deleteFlag: false,
            genres: [
                {
                    id: 18,
                    name: 'Drama',
                },
                {
                    id: 37,
                    name: 'Western',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 189000,
            detailShowingTypes: [
                {
                    id: 917,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 918,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 919,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 920,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 238,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//wwqHma9UrYCTzspanzKwlxKcOwt.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 125,
            title: 'A Quiet Place: Day One',
            adult: false,
            budget: 67000000,
            originalLanguage: 'en',
            overview:
                'As New York City is invaded by alien creatures who hunt by sound, a woman named Sam fights to survive with her cat.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//yrpPYKijwdMHyTGIOd1iK1h0Xno.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 6.918,
            voteCount: 1279,
            runtime: 99,
            releaseDate: '2024-06-26',
            deleteFlag: false,
            genres: [
                {
                    id: 27,
                    name: 'Horror',
                },
                {
                    id: 53,
                    name: 'Thriller',
                },
                {
                    id: 878,
                    name: 'Science Fiction',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 88000,
            detailShowingTypes: [
                {
                    id: 497,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 498,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 499,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 500,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 125,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaulBackdop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 85,
            title: 'Beverly Hills Cop: Axel F',
            adult: false,
            budget: 150000000,
            originalLanguage: 'en',
            overview:
                'Forty years after his unforgettable first case in Beverly Hills, Detroit cop Axel Foley returns to do what he does best: solve crimes and cause chaos.',
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//zszRKfzjM5jltiq8rk6rasKVpUv.jpg',
            backdropPath: 'https://image.tmdb.org/t/p/w500//k0DEUZqbB9bVcm2NsVaMkdd4Vs8.jpg',
            voteAverage: 6.853,
            voteCount: 834,
            runtime: 118,
            releaseDate: '2024-06-20',
            deleteFlag: false,
            genres: [
                {
                    id: 28,
                    name: 'Action',
                },
                {
                    id: 35,
                    name: 'Comedy',
                },
                {
                    id: 80,
                    name: 'Crime',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 114000,
            detailShowingTypes: [
                {
                    id: 337,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 338,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 339,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 340,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 85,
                    imgUrl: 'https://image.tmdb.org/t/p/w500//k0DEUZqbB9bVcm2NsVaMkdd4Vs8.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 174,
            title: 'Trigger Warning',
            adult: false,
            budget: 0,
            originalLanguage: 'en',
            overview:
                "A Special Forces commando uncovers a dangerous conspiracy when she returns to her hometown looking for answers into her beloved father's death.",
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//lJN24nn28s5afC1UnLPYRgYOp1K.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 5.82,
            voteCount: 391,
            runtime: 106,
            releaseDate: '2024-06-20',
            deleteFlag: false,
            genres: [
                {
                    id: 28,
                    name: 'Action',
                },
            ],
            monthToSchedule: 9,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 63000,
            detailShowingTypes: [
                {
                    id: 693,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 694,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 695,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 696,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 182,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
        {
            id: 58,
            title: 'Trigger Warning',
            adult: false,
            budget: 0,
            originalLanguage: 'en',
            overview:
                "A Special Forces commando uncovers a dangerous conspiracy when she returns to her hometown looking for answers into her beloved father's death.",
            status: 'Released',
            video: 'no',
            posterPath: 'https://image.tmdb.org/t/p/w500//lJN24nn28s5afC1UnLPYRgYOp1K.jpg',
            backdropPath: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
            voteAverage: 5.813,
            voteCount: 387,
            runtime: 106,
            releaseDate: '2024-06-20',
            deleteFlag: false,
            genres: [
                {
                    id: 28,
                    name: 'Action',
                },
            ],
            monthToSchedule: 8,
            yearToSchedule: 2024,
            totalShowings: 15,
            totalDateShowingsInMonth: 10,
            priceEachSeat: 161000,
            detailShowingTypes: [
                {
                    id: 229,
                    name: '2D',
                    showings: 4,
                },
                {
                    id: 230,
                    name: '2D subtitles',
                    showings: 4,
                },
                {
                    id: 231,
                    name: '3D',
                    showings: 4,
                },
                {
                    id: 232,
                    name: '3D subtitles',
                    showings: 3,
                },
            ],
            galleries: [
                {
                    id: 58,
                    imgUrl: 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg',
                },
            ],
            userFavoriteMovies: [],
        },
    ];
    const favoriteMovies = [
        {
            runtime: 149,
            id: 4,
            title: 'Furiosa: A Mad Max Saga',
            movieId: 137,
            posterPath: 'https://image.tmdb.org/t/p/w500//iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
            releaseDate: '2024-05-22',
            dateAdded: '2024-08-29T10:29:30.287999',
        },
        {
            runtime: 167,
            id: 5,
            title: 'Dune: Part Two',
            movieId: 42,
            posterPath: 'https://image.tmdb.org/t/p/w500//1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
            releaseDate: '2024-02-27',
            dateAdded: '2024-08-29T12:19:19.045603',
        },
        {
            runtime: 92,
            id: 6,
            title: 'Descendants: The Rise of Red',
            movieId: 132,
            posterPath: 'https://image.tmdb.org/t/p/w500//t9u9FWpKlZcp0Wz1qPeV5AIzDsk.jpg',
            releaseDate: '2024-07-11',
            dateAdded: '2024-09-02T21:32:31.440789',
        },
        {
            runtime: 101,
            id: 9,
            title: 'The Garfield Movie',
            movieId: 129,
            posterPath: 'https://image.tmdb.org/t/p/w500//xYduFGuch9OwbCOEUiamml18ZoB.jpg',
            releaseDate: '2024-04-30',
            dateAdded: '2024-09-02T21:57:22.249421',
        },
    ];

    return (
        <section>
            <FavoriteMain
                username="Piti thuong"
                userId="user_2jP9y7BWlKP6UTCmZsVYqd9fPgz"
                listFavoriteMovies={favoriteMovies}
                listPopularMovies={popularMovies}
            />
        </section>
    );
};

export default TestPage;
