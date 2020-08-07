const gulp = require('gulp');
const sftp = require('gulp-sftp');

gulp.task('sftp', () => gulp
  .src([
    './dist/**',
  ])
  // sit
  .pipe(
    sftp({
      port: '22',
      host: '10.16.148.205',
      user: 'apps',
      pass: ':N6ZDI8lLN',
      remotePath: '/apps/svr/nginx/html',
    }),
  )
  .pipe(
    sftp({
      port: '22',
      host: '10.16.148.206',
      user: 'apps',
      pass: ':N6ZDI8lLN',
      remotePath: '/apps/svr/nginx/html',
    }),
  )
  // uat
  .pipe(
    sftp({
      port: '22',
      host: '10.16.150.216',
      user: 'apps',
      pass: 'e)yuLR86-&',
      remotePath: '/apps/svr/nginx/html',
    }),
  )
  .pipe(
    sftp({
      port: '22',
      host: '10.16.150.217',
      user: 'apps',
      pass: 'e)yuLR86-&',
      remotePath: '/apps/svr/nginx/html',
    }),
  )
  // prod
  .pipe(
    sftp({
      port: '22',
      host: '10.18.62.122',
      user: 'apps',
      pass: 'fFTesy76k',
      remotePath: '/apps/svr/nginx/html',
    }),
  )
  .pipe(
    sftp({
      port: '22',
      host: '10.18.62.124',
      user: 'apps',
      pass: 'fFTesy76k',
      remotePath: '/apps/svr/nginx/html',
    }),
  )
  .pipe(
    sftp({
      port: '22',
      host: '10.18.62.126',
      user: 'apps',
      pass: 'fFTesy76k',
      remotePath: '/apps/svr/nginx/html',
    }),
  ),
);
