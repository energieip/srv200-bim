COMPONENT=energieip-srv200-webui

.PHONY: deb-amd64 clean

all: deb-amd64

deb-amd64:
	$(eval VERSION := $(shell cat ./version))
	$(eval ARCH := $(shell echo "amd64"))
	$(eval BUILD_NAME := $(shell echo "$(COMPONENT)-$(VERSION)-$(ARCH)"))
	$(eval BUILD_PATH := $(shell echo "build/$(BUILD_NAME)"))
	make deb VERSION=$(VERSION) BUILD_PATH=$(BUILD_PATH) ARCH=$(ARCH) BUILD_NAME=$(BUILD_NAME)

deb:
	mkdir -p $(BUILD_PATH)/media/userdata/www/webui $(BUILD_PATH)/etc/apache2/sites-available
	cp -r ./scripts/DEBIAN $(BUILD_PATH)/
	sed -i "s/amd64/$(ARCH)/g" $(BUILD_PATH)/DEBIAN/control
	sed -i "s/VERSION/$(VERSION)/g" $(BUILD_PATH)/DEBIAN/control
	sed -i "s/COMPONENT/$(COMPONENT)/g" $(BUILD_PATH)/DEBIAN/control
	cp ./scripts/Makefile $(BUILD_PATH)/../
	cp ./scripts/*.conf $(BUILD_PATH)/etc/apache2/sites-available
	cp -r src/* $(BUILD_PATH)/media/userdata/www/webui
	make -C build DEB_PACKAGE=$(BUILD_NAME) deb

clean:
	rm -rf bin build
