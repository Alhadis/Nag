# Development use only. End-users won't need this.
all: clean nag.min.js


# Generate a compressed version of a script
%.min.js: %.js
	@perl -0777 -pe 's{/\*\~+\s*(\w+)?\s*\*/.*?/\*\s*\1?\s*\~+\*/}{}gsi' < $< | \
	uglifyjs --mangle --compress > $@


# Annihilate the compressed script
clean:
	@rm -f nag.min.js


.PHONY: clean


#===============================================================================

# Run a Make task in response to filesystem changes
# Usage: $(call watch,file-pattern,task-name)
define watch
	@watchman watch $(shell pwd) > /dev/null
	@watchman -- trigger $(shell pwd) '$(2)-$(1)' $(1) -- make $(2) > /dev/null
endef

# Complementary unwatch function
define unwatch
	@watchman watch-del $(shell pwd) > /dev/null
endef


# Recompress the file when it's been modified
watch:
	$(call watch,nag.js,nag.min.js)

unwatch:
	$(call unwatch)
