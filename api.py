# # import logging
# # from binance.client import Client

# # # Setup logging
# # logging.basicConfig(filename='withdrawal_logs.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # # Binance API credentials
# # api_key = 'AQh3Ax3ayH2rLsGzbIBQJ8k4MILrBsqq8OcZxrPRwCRtBwZFFTftyS6b1d7ZjUks'
# # api_secret = 'msSWWYjpFzGxftYqjSEVApAOuKCPWEgHowh1CNgG7xkYxtk91kKuqUDIyGZxWKZH'

# # client = Client(api_key, api_secret)

# # # Parameters for the withdrawal
# # coin = 'USDT'
# # address = '0xC8646F12889FAde11d7D8A150DdAbf49BFc39Bc5'
# # amount = '10'
# # network = 'BSC'  # Binance Smart Chain for BEP20 tokens

# # # Execute withdrawal
# # try:
# #     result = client.withdraw(coin=coin, address=address, amount=amount, network=network)
# #     logging.info(f"Successful Withdrawal: {result}")
# #     print("Withdrawal request submitted:", result)
# # except Exception as e:
# #     logging.error(f"Failed Withdrawal: {e}")
# #     print("An error occurred:", e)



# # from flask import Flask, request, jsonify
# # import logging
# # from binance.client import Client

# # app = Flask(__name__)

# # # Setup logging
# # logging.basicConfig(filename='withdrawal_logs.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # # Configure your Binance API credentials securely
# # api_key = 'AQh3Ax3ayH2rLsGzbIBQJ8k4MILrBsqq8OcZxrPRwCRtBwZFFTftyS6b1d7ZjUks'
# # api_secret = 'msSWWYjpFzGxftYqjSEVApAOuKCPWEgHowh1CNgG7xkYxtk91kKuqUDIyGZxWKZH'


# # client = Client(api_key, api_secret)

# # @app.route('/withdraw', methods=['POST'])
# # def withdraw():
# #     # Retrieve data from request
# #     data = request.get_json()
# #     coin = data.get('coin', 'USDT')
# #     address = data.get('address')
# #     amount = data.get('amount')
# #     network = data.get('network', 'BSC')

# #     # Execute withdrawal
# #     try:
# #         result = client.withdraw(coin=coin, address=address, amount=amount, network=network)
# #         logging.info(f"Successful Withdrawal: {result}")
# #         return jsonify({"message": "Withdrawal request submitted", "details": result}), 200
# #     except Exception as e:
# #         logging.error(f"Failed Withdrawal: {e}")
# #         return jsonify({"error": str(e)}), 500

# # if __name__ == '__main__':
# #     app.run(host='127.0.0.1', port=8080, debug=True)





import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, request, jsonify
from binance.client import Client

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('withdrawal_logs')
handler = RotatingFileHandler('withdrawal_logs.log', maxBytes=10000, backupCount=3)
logger.addHandler(handler)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Configure your Binance API credentials securely
api_key = 'ILIDewVOAhBMa8z8Nkqlyf21wZTJ8jjrNOSfA0Wj4GLGpqdniP693U1RmWd3DvAA'
api_secret = 'QgNNXbu5rh2jfI8KIbstwJcF96JrqVB8JOPfaf1p7mtndizKxPq4J4ru1u70SSVi'


client = Client(api_key, api_secret)

# @app.route('/withdraw', methods=['POST'])
# def withdraw():
#     # Retrieve data from request
#     data = request.get_json()
#     coin = data.get('coin', 'USDT')
#     address = data.get('address')
#     amount = data.get('amount')
#     network = data.get('network', 'BSC')

#     # Execute withdrawal
#     try:
#         result = client.withdraw(coin=coin, address=address, amount=amount, network=network)
#         logger.info(f"Successful Withdrawal: Coin={coin}, Address={address}, Amount={amount}, Network={network}, Result={result}")
#         return jsonify({"message": "Withdrawal request submitted", "details": result}), 200
#     except Exception as e:
#         logger.error(f"Failed Withdrawal: Coin={coin}, Address={address}, Amount={amount}, Network={network}, Error={str(e)}")
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(host='127.0.0.1', port=8080, debug=True)


import time

@app.route('/withdraw', methods=['POST'])
def withdraw():
    # Retrieve data from request
    data = request.get_json()
    coin = data.get('coin', 'USDT')
    address = data.get('address')
    amount = data.get('amount')
    network = data.get('network', 'BSC')

    # Retry logic for handling timestamp issues
    retry_attempts = 3
    for attempt in range(retry_attempts):
        try:
            result = client.withdraw(coin=coin, address=address, amount=amount, network=network)
            logger.info(f"Successful Withdrawal: Coin={coin}, Address={address}, Amount={amount}, Network={network}, Result={result}")
            return jsonify({"message": "Withdrawal request submitted", "details": result}), 200
        except Exception as e:
            if attempt == retry_attempts - 1:  # Last attempt
                logger.error(f"Failed Withdrawal: Coin={coin}, Address={address}, Amount={amount}, Network={network}, Error={str(e)}")
                return jsonify({"error": str(e)}), 500
            logger.warning(f"Retrying Withdrawal: Attempt {attempt + 1} for Coin={coin}, Address={address}, Amount={amount}, Network={network}")
            time.sleep(1)  # Wait for 1 second before retrying

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)


