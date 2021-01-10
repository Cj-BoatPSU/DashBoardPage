// eslint-disable-next-line no-undef
window.INFLUX_ENV = {
    /** InfluxDB v2 URL, '/influxdb' relies upon proxy to forward to the target influxDB */
    url: '/influx', //'http://localhost:8086'
    /** InfluxDB authorization token */
    token: 'my-token',
    /** Organization within InfluxDB  */
    org: 'my-org',
    /**InfluxDB bucket used in examples  */
    bucket: 'db_version2',
    // ONLY onboarding example
    /**InfluxDB user  */
    username: 'mydb',
    /**InfluxDB password  */
    password: 'cjboat',
}