const mockSendEvent = jest.fn()
jest.mock('ffc-protective-monitoring', () => {
  return {
    PublishEvent: jest.fn().mockImplementation(() => {
      return { sendEvent: mockSendEvent }
    })
  }
})

const mockSendMessage = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: jest.fn()
      }
    })
  }
})

jest.mock('../../app/services/session-handler')

const publishClaim = require('../../app/messaging/publish-claim')
const sessionHandler = require('../../app/services/session-handler')
let request

describe('publish claim', () => {
  const claim = {
    claimId: 'MINE1',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }

  beforeEach(() => {
    sessionHandler.get.mockResolvedValue(claim)
    request = {
      headers: {
        'x-forwarded-for': '127.0.0.1'
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should publish claim', async () => {
    await publishClaim(request)
    expect(mockSendEvent).toHaveBeenCalledTimes(1)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })
})
