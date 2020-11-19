import moment from 'moment'

export default {
  methods: {
    nowUTC: () => moment().utc().unix()
  }
}
