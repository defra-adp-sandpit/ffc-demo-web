const mockSendEvent = jest.fn()
jest.mock('ffc-protective-monitoring', () => {
  return {
    PublishEvent: jest.fn().mockImplementation(() => {
      return { sendEvent: mockSendEvent }
    })
  }
})

const sendProtectiveMonitoringEvent = require('../../app/services/protective-monitoring-service')
let request

describe('send protective monitoring event', () => {
  const claim = {
    claimId: 'MINE1',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }

  test('should send protective monitoring payload with x-forwarded-for header', async () => {
    request = {
      headers: {
        'x-forwarded-for': '127.0.0.1'
      }
    }

    await sendProtectiveMonitoringEvent(request, claim, 'Test message')
    expect(mockSendEvent).toHaveBeenCalledTimes(1)
  })

  test('should send protective monitoring payload with remoteAddress', async () => {
    request = {
      headers: {
      },
      info: {
        remoteAddress: '127.0.0.1'
      }
    }

    await sendProtectiveMonitoringEvent(request, claim, 'Test message')
    expect(mockSendEvent).toHaveBeenCalledTimes(2)
  })
})
