module.exports = {
  DATABASE: 'mongodb://localhost/stalotenisas',
  // DATABASE: 'mongodb://eqls:abrikosas2@ds245238.mlab.com:45238/sandbox',
  PORT: '8080',
  JWT_SECRET: 'secretvery',
  //Ratings config
  STRONGER_DIFF: [
    {
      max: 25,
      min: 1,
      win_points: 9,
      lost_points: 4.5
    },
    {
      max: 50,
      min: 26,
      win_points: 8,
      lost_points: 4
    },
    {
      max: 100,
      min: 51,
      win_points: 7,
      lost_points: 3.5
    },
    {
      max: 150,
      min: 101,
      win_points: 6,
      lost_points: 3
    },
    {
      max: 200,
      min: 151,
      win_points: 5,
      lost_points: 2.5
    },
    {
      max: 300,
      min: 201,
      win_points: 4,
      lost_points: 2
    },
    {
      max: 400,
      min: 301,
      win_points: 3,
      lost_points: 1.5
    },
    {
      max: 500,
      min: 401,
      win_points: 2,
      lost_points: 1
    },
    {
      max: 750,
      min: 501,
      win_points: 1,
      lost_points: 0.5
    },
    {
      max: 99999,
      min: 751,
      win_points: 0,
      lost_points: 0
    },
  ],
  WEAKER_DIFF: [
    {
      max: 24,
      min: 0,
      win_points: 10,
      lost_points: 5
    },
    {
      max: 49,
      min: 25,
      win_points: 12,
      lost_points: 6
    },
    {
      max: 99,
      min: 50,
      win_points: 17,
      lost_points: 7
    },
    {
      max: 149,
      min: 100,
      win_points: 16,
      lost_points: 8
    },
    {
      max: 199,
      min: 150,
      win_points: 20,
      lost_points: 10
    },
    {
      max: 299,
      min: 200,
      win_points: 24,
      lost_points: 12
    },
    {
      max: 399,
      min: 300,
      win_points: 28,
      lost_points: 14
    },
    {
      max: 499,
      min: 400,
      win_points: 32,
      lost_points: 16
    },
    {
      max: 749,
      min: 500,
      win_points: 36,
      lost_points: 18
    },
    {
      max: 99999,
      min: 749,
      win_points: 40,
      lost_points: 20
    },
  ]
}
