const gulp = require('gulp');
const sftp = require('gulp-sftp');

gulp.task('sftp-sit', () => gulp
  .src([
    './dist/**',
  ])
  .pipe(
    sftp({
      port: '22',
      host: '10.16.148.102',
      user: 'apps',
      pass: 'oCK%!YF3IS',
      remotePath: '/apps/svr/apache/htdocs',
    }),
  )
  .pipe(
    sftp({
      port: '22',
      host: '10.16.148.103',
      user: 'apps',
      pass: 'oCK%!YF3IS',
      remotePath: '/apps/svr/apache/htdocs',
    }),
  ));

gulp.task('sftp-uat', () => gulp
  .src([
    './dist/**',
  ])
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
  ));
